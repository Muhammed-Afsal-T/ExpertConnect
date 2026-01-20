import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Chat.module.css';
import { FaVideo, FaPaperPlane, FaArrowLeft, FaRegCalendarAlt, FaClock, FaUserAlt, FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5000");

const ExpertChat = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(); 
  const [expert] = useState(JSON.parse(localStorage.getItem('user')));
  const [paidUsers, setPaidUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showSlotModal, setShowSlotModal] = useState(false);

  useEffect(() => {
    fetchPaidUsers();
  }, []);

  useEffect(() => {
  const checkSessionStatus = () => {
    if (!selectedUser) return;

    const now = new Date().toLocaleTimeString('en-GB', { 
      timeZone: 'Asia/Kolkata', hour12: false, hour: '2-digit', minute: '2-digit' 
    });
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    if (selectedUser.day === today) {
      if (now >= selectedUser.slot.startTime && now < selectedUser.slot.endTime && !selectedUser.isVideoActive) {
        window.location.reload();
      }

      if (now >= selectedUser.slot.endTime) {
        alert("Session time expired! The consultation is now closed.");        setTimeout(() => {
          window.location.reload();
        }, 2000); 
      }
    }
  };

  const interval = setInterval(checkSessionStatus, 60000); 

  return () => clearInterval(interval);
}, [selectedUser]);

  // --- Socket.io Logic Start ---

  useEffect(() => {
    if (selectedUser) {
      socket.emit("join_chat", selectedUser._id);
      fetchMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (selectedUser && data.bookingId === selectedUser._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [selectedUser]);

  // --- Socket.io Logic End ---

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchPaidUsers = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/booking/get-expert-chat-users', { expertId: expert._id });
      if (res.data.success) {
        setPaidUsers(res.data.bookings);
      }
    } catch (error) {
      console.log("Error fetching paid users", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/message/get-messages/${selectedUser._id}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.log("Error fetching messages", error);
    }
  };

  const handleVideoClick = () => {
    if (selectedUser.isVideoActive) {
      window.open(`https://meet.jit.si/ExpertConnect_${selectedUser._id}`, '_blank');
    } else {
      alert(`Session Not Active!\nYour video session will be active on ${selectedUser.day} from ${selectedUser.slot.startTime} to ${selectedUser.slot.endTime}`);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const messageData = {
        bookingId: selectedUser._id,
        sender: expert._id,
        receiver: selectedUser.userId._id,
        message: inputText
      };

      const res = await axios.post('http://localhost:5000/api/v1/message/send-message', messageData);
      
      if (res.data.success) {
        socket.emit("send_message", res.data.newMessage);

        setMessages([...messages, res.data.newMessage]);
        setInputText("");
      }
    } catch (error) {
      console.log("Error sending message", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.chatContainer}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.backAction} onClick={() => navigate(-1)}>
              <FaArrowLeft /> <span>Back</span>
            </div>
            <h3>Consultations</h3>
          </div>
          <div className={styles.expertList}>
            {paidUsers.length > 0 ? (
              paidUsers.map((item, index) => (
                <div 
                  key={index} 
                  className={`${styles.expertCard} ${selectedUser?._id === item._id ? styles.activeCard : ''}`}
                  onClick={() => setSelectedUser(item)}
                >
                  <img src={item.userId?.image || 'https://via.placeholder.com/50'} alt="User" className={styles.sidebarProfilePic} />
                  <div className={styles.expertInfo}>
                    <h4>{item.userId?.name}</h4>
                    <p>{item.userId?.specialization}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noExperts}>No paid consultations found.</p>
            )}
          </div>
        </div>

        <div className={styles.mainChat}>
          {selectedUser ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.headerLeft}>
                  <img src={selectedUser.userId?.image} alt="Profile" className={styles.headerProfilePic} />
                  <div>
                    <h4>{selectedUser.userId?.name}</h4>
                    <span className={selectedUser.isVideoActive ? styles.active : styles.notActive}>
                      {selectedUser.isVideoActive ? '● Active' : '● Session Not Active'}
                    </span>
                  </div>
                </div>
                <div className={styles.headerRight}>
                  <button className={styles.slotBtn} onClick={() => setShowSlotModal(true)}>
                    Slot Details
                  </button>
                  <FaVideo 
                    className={`${styles.videoIcon} ${!selectedUser.isVideoActive ? styles.disabled : ''}`} 
                    onClick={handleVideoClick}
                  />
                </div>
              </div>

              <div className={styles.messageArea}>
                {messages.length === 0 && <p className={styles.emptyChat}>Start conversation with {selectedUser.userId?.name}</p>}
                {messages.map((m, i) => (
                  <div key={i} ref={scrollRef} className={styles.messageRow}>
                    <p className={m.sender === expert._id ? styles.sent : styles.received}>
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
              <form className={styles.inputArea} onSubmit={handleSendMessage}>
                <input type="text" placeholder="Type here..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <button type="submit"><FaPaperPlane /></button>
              </form>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a User to start chat</p>
            </div>
          )}
        </div>
      </div>

      {showSlotModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
             <div className={styles.modalHeader}>
                <img src={selectedUser.userId?.image} alt="User" className={styles.modalImg} />
                <h3>Appointment Slot</h3>
             </div>
             <div className={styles.modalBody}>
               <div className={styles.detailRow}><FaUserAlt /> <span><strong>Name:</strong> {selectedUser.userId?.name}</span></div>
               <div className={styles.detailRow}><FaBriefcase /> <span><strong>Specialization:</strong> {selectedUser.userId?.specialization || 'N/A'}</span></div>
               <div className={styles.detailRow}><FaRegCalendarAlt /> <span><strong>Date:</strong> {selectedUser.day}</span></div>
               <div className={styles.detailRow}><FaClock /> <span><strong>Time:</strong> {selectedUser.slot.startTime} - {selectedUser.slot.endTime}</span></div>
             </div>
             <button className={styles.doneBtn} onClick={() => setShowSlotModal(false)}>Done</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertChat;