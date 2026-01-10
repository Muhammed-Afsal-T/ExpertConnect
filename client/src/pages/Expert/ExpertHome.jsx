import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import styles from './ExpertHome.module.css';
import { FaCalendarCheck, FaWallet, FaClock, FaExclamationTriangle, FaCheck, FaTimes, FaRegCalendarAlt, FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExpertHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData?._id) fetchBookings(userData._id);
  }, []);

  const fetchBookings = async (expertId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/booking/get-expert-bookings', { expertId });
      if (res.data.success) {
        // --- റിക്വസ്റ്റുകളെ സോർട്ട് ചെയ്യുന്ന ലോജിക് ---
        const sortedData = res.data.data.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1; // a (pending) മുകളിലേക്ക് വരുന്നു
          if (a.status !== 'pending' && b.status === 'pending') return 1;  // b (pending) മുകളിലേക്ക് വരുന്നു
          return 0; // മറ്റുള്ളവയുടെ ക്രമം മാറ്റുന്നില്ല
        });
        setBookings(sortedData);
      }
    } catch (error) {
      console.log("Error fetching bookings", error);
    }
  };

  const handleStatus = async (bookingId, status) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/booking/update-status', { bookingId, status });
      if (res.data.success) {
        alert(`Booking ${status}`);
        fetchBookings(user._id); // സ്റ്റാറ്റസ് മാറ്റിയ ശേഷം ലിസ്റ്റ് വീണ്ടും സോർട്ട് ചെയ്ത് വരും
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Error updating status");
    }
  };

  const isSlotTaken = (day, startTime) => {
    return bookings.some(b => b.status === 'accepted' && b.day === day && b.slot?.startTime === startTime);
  };

  const stats = {
    totalBookings: bookings.filter(b => b.status === 'accepted').length,
    totalEarnings: bookings.filter(b => b.status === 'completed').reduce((acc, curr) => acc + curr.amount, 0),
    pendingRequests: bookings.filter(b => b.status === 'pending').length
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Welcome, {user?.name || 'Expert'}!</h1>
          {!user?.isVerified ? (
            <div className={styles.pendingBanner}>
              <FaExclamationTriangle /> 
              <span>Your profile is under review. Get verified to accept requests.</span>
              <button onClick={() => navigate('/expert/profile')} className={styles.completeBtn}>Profile</button>
            </div>
          ) : (
            <div className={styles.verifiedBanner}>Verified Professional Account</div>
          )}
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.iconBox}><FaCalendarCheck /></div>
            <div className={styles.statInfo}><h3>{stats.totalBookings}</h3><p>Confirmed Bookings</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.iconBox}><FaWallet /></div>
            <div className={styles.statInfo}><h3>₹{stats.totalEarnings}</h3><p>Total Earnings</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.iconBox}><FaClock /></div>
            <div className={styles.statInfo}><h3>{stats.pendingRequests}</h3><p>New Requests</p></div>
          </div>
        </div>

        <div className={styles.requestsSection}>
          <h2>Consultation Requests</h2>
          <div className={styles.requestList}>
            {bookings.length > 0 ? (
              bookings.map((booking) => {
                const alreadyBooked = isSlotTaken(booking.day, booking.slot?.startTime);
                
                return (
                  <div key={booking._id} className={styles.requestCard}>
                    <div className={styles.userInfo}>
                      <img src={booking.userId?.image} alt="User" className={styles.userImg} />
                      <div className={styles.userText}>
                        <h4>{booking.userId?.name}</h4>
                        <p className={styles.dateTime}>
                          <FaRegCalendarAlt /> {booking.day} | <FaClock /> {booking.slot?.startTime} - {booking.slot?.endTime}
                        </p>
                      </div>
                    </div>

                    <div className={styles.rightSection}>
                      {booking.status === 'pending' ? (
                        alreadyBooked ? (
                          <div className={styles.blockedAction}>
                            <span className={styles.slotWarning}><FaBan /> Slot already booked</span>
                            <button onClick={() => handleStatus(booking._id, 'rejected')} className={styles.rejectBtn} title="Reject"><FaTimes /> Reject</button>
                          </div>
                        ) : (
                          <div className={styles.actionBtns}>
                            <button onClick={() => handleStatus(booking._id, 'accepted')} className={styles.acceptBtn} title="Accept"><FaCheck /> Accept</button>
                            <button onClick={() => handleStatus(booking._id, 'rejected')} className={styles.rejectBtn} title="Reject"><FaTimes /> Reject</button>
                          </div>
                        )
                      ) : (
                        <span className={`${styles.statusText} ${styles[booking.status]}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.noDataText}>No requests at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertHome;