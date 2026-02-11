import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Chat.module.css';

const VideoCall = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const jitsiContainerRef = useRef(null);
    const apiRef = useRef(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [booking, setBooking] = useState(null);

    const redirectPath = user.role === 'expert' ? '/expert/chat' : '/chat';

    const handleExit = useCallback(() => {
        if (apiRef.current) {
            apiRef.current.dispose();
        }
        navigate(redirectPath);
    }, [navigate, redirectPath]);

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/v1/booking/get-booking-by-id/${bookingId}`);
            if (res.data.success) {
                setBooking(res.data.booking);
            }
        } catch (error) {
            console.log("Error fetching booking details", error);
        }
    };

    useEffect(() => {
        const domain = "meet.jit.si";
        const options = {
            roomName: `ExpertConnect_${bookingId}`,
            width: "100%",
            height: "100%",
            parentNode: jitsiContainerRef.current,
            userInfo: { displayName: user.name },
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                disableModeratorIndicator: true, 
                enableWelcomePage: false,
                enableClosePage: false,
            },
            interfaceConfigOverwrite: {
                TILE_VIEW_MAX_COLUMNS: 2,
                SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            }
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        apiRef.current = api;

        api.addEventListeners({
            toolbarButtonClicked: (data) => {
                if (data.name === 'hangup') {
                    handleExit();
                }
            },
            readyToClose: () => {
                handleExit();
            }
        });

        return () => {
            if (apiRef.current) apiRef.current.dispose();
        };
    }, [bookingId, user.name, handleExit]);

    useEffect(() => {
        const checkSessionExpiry = () => {
            if (booking && booking.slot && booking.slot.endTime) {
                const now = new Date().toLocaleTimeString('en-GB', { 
                    timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' 
                });

                console.log(`Current Time: ${now}, End Time: ${booking.slot.endTime}`);

                if (now >= booking.slot.endTime) {
                    console.log("Session Ended. Redirecting...");
                    handleExit();
                }
            }
        };

        const timer = setInterval(checkSessionExpiry, 5000);

        return () => clearInterval(timer);
    }, [booking, handleExit]);

    return (
        <div className={styles.videoPageContainer}>
            <div className={styles.videoHeader}>
                <h4>ExpertConnect - Video Session</h4>
                <button onClick={handleExit} className={styles.leaveBtn}>Leave Session</button>
            </div>
            <div ref={jitsiContainerRef} className={styles.jitsiEmbed} />
        </div>
    );
};

export default VideoCall;