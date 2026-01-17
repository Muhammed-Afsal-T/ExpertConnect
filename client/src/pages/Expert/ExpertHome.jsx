import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import styles from './ExpertHome.module.css';
import { FaCalendarCheck, FaWallet, FaClock, FaExclamationTriangle, FaCheck, FaTimes, FaRegCalendarAlt, FaBan, FaUserAlt, FaEnvelope, FaBriefcase, FaVenusMars, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExpertHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData?._id) fetchBookings(userData._id);
  }, []);

  const fetchBookings = async (expertId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/booking/get-expert-bookings', { expertId });
      if (res.data.success) {
        const sortedData = res.data.data.sort((a, b) => {
          if (a.status === 'pending' && b.status !== 'pending') return -1;
          if (a.status !== 'pending' && b.status === 'pending') return 1;
          return 0;
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
        fetchBookings(user._id);
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
    totalBookings: bookings.filter(b => b.status === 'accepted' || b.status === 'paid').length,
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
                    <div className={styles.userInfo} onClick={() => setSelectedUser(booking.userId)} style={{cursor: 'pointer'}}>
                      <img src={booking.userId?.image} alt="User" className={styles.userImg} />
                      <div className={styles.userText}>
                        <h4>{booking.userId?.name} <span className={styles.viewLink}>(View Details)</span></h4>
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

      {/* --- User Details Modal --- */}
      {selectedUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={() => setSelectedUser(null)}>×</button>
            <div className={styles.modalHeader}>
               <img src={selectedUser.image} alt="User" className={styles.modalImg} />
               <h3>User Details</h3>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}><FaUserAlt /> <span><strong>Name:</strong> {selectedUser.name}</span></div>
              <div className={styles.detailRow}><FaEnvelope /> <span><strong>Email:</strong> {selectedUser.email}</span></div>
              <div className={styles.detailRow}><FaInfoCircle /> <span><strong>Age:</strong> {selectedUser.age || 'N/A'}</span></div>
              <div className={styles.detailRow}><FaVenusMars /> <span><strong>Gender:</strong> {selectedUser.gender || 'N/A'}</span></div>
              <div className={styles.detailRow}><FaBriefcase /> <span><strong>Profession/Interest:</strong> {selectedUser.specialization || 'N/A'}</span></div>
            </div>
            <button className={styles.doneBtn} onClick={() => setSelectedUser(null)}>Done</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertHome;