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

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectBookingId, setRejectBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedBookingForAccept, setSelectedBookingForAccept] = useState(null);
  const [allStats, setAllStats] = useState({ totalBookings: 0, totalEarnings: 0, pendingRequests: 0 });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    if (userData?._id) fetchBookings(userData._id, 1);
  }, []);

  const fetchBookings = async (expertId, currentPage = 1) => {
    try {
      setLoading(true);
      const res = await axios.post(`http://localhost:5000/api/v1/booking/get-expert-bookings?page=${currentPage}&limit=20`, { expertId });
      
      if (res.data.success) {
        setAllStats(res.data.stats);
        const statusPriority = { 
          'pending': 1, 
          'accepted': 2, 
          'paid': 3 
        };

        // ഡാറ്റ സോർട്ട് ചെയ്യുന്നു
        const sortedData = [...res.data.data].sort((a, b) => {
          const priorityA = statusPriority[a.status] || 4; // മറ്റുള്ളവ (completed, rejected) അവസാനം വരും
          const priorityB = statusPriority[b.status] || 4;
          return priorityA - priorityB;
        });

        setBookings(sortedData);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (error) {
      console.log("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && page > 0) {
      fetchBookings(user._id, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [page]);

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

 const openRejectModal = (bookingId) => {
  setRejectBookingId(bookingId);
  setShowRejectModal(true);
};

const submitRejection = async () => {
  if (!rejectionReason.trim()) return alert("Please provide a reason.");

  try {
    const res = await axios.post('http://localhost:5000/api/v1/booking/update-status', {
      bookingId: rejectBookingId,
      status: 'rejected',
      rejectionReason: rejectionReason
    });
    
    if (res.data.success) {
      alert("Booking Rejected.");
      setShowRejectModal(false);
      setRejectionReason("");
      fetchBookings(user._id);
    }
  } catch (error) {
    alert("Action failed.");
  }
};
  const openAcceptModal = (booking) => {
    setSelectedBookingForAccept(booking);
    setShowAcceptModal(true);
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
            <div className={styles.statInfo}><h3>{allStats.totalBookings}</h3><p>Confirmed Bookings</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.iconBox}><FaWallet /></div>
            <div className={styles.statInfo}><h3>₹{allStats.totalEarnings}</h3><p>Total Earnings</p></div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.iconBox}><FaClock /></div>
            <div className={styles.statInfo}><h3>{allStats.pendingRequests}</h3><p>New Requests</p></div>
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
                        <span><FaRegCalendarAlt /> {booking.day}</span>
                            <span><FaClock /> {booking.slot?.startTime} - {booking.slot?.endTime}</span>
                            </p>
                      </div>
                    </div>

                    <div className={styles.rightSection}>
                      {booking.status === 'pending' ? (
                        alreadyBooked ? (
                          <div className={styles.blockedAction}>
                            <span className={styles.slotWarning}><FaBan /> Slot already booked</span>
                            <button onClick={() => openRejectModal(booking._id)} className={styles.rejectBtn} title="Reject"><FaTimes /> Reject</button>
                          </div>
                        ) : (
                          <div className={styles.actionBtns}>
                            <button onClick={() => openAcceptModal(booking)} className={styles.acceptBtn} title="Accept"><FaCheck /> Accept</button>
                            <button onClick={() => openRejectModal(booking._id)} className={styles.rejectBtn} title="Reject"><FaTimes /> Reject</button>
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
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>Prev</button>
              <span className={styles.pageInfo}>Page <strong>{page}</strong> of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next</button>
            </div>
          )}
        </div>
      </div>

    {showAcceptModal && selectedBookingForAccept && (
    <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <div className={styles.modalHeader}>
         <img src={selectedBookingForAccept.userId?.image} className={styles.modalImg} alt="User" />
         <h3>Consultation Topic</h3>
      </div>
      <div className={styles.topicBox}>
        <div className={styles.topicContent}>{selectedBookingForAccept.topic}</div>
      </div>
      <div className={styles.modalActions}>
        <button 
          className={styles.acceptBtn} 
          onClick={() => {
            handleStatus(selectedBookingForAccept._id, 'accepted');
            setShowAcceptModal(false);
          }}
        >
          Confirm Accept
        </button>
        <button className={styles.cancelBtn} onClick={() => setShowAcceptModal(false)}>Cancel</button>
        </div>
        </div>
      </div>
      )}
      
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

      {showRejectModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <button className={styles.closeBtn} onClick={() => setShowRejectModal(false)}>×</button>
      <h3>Rejection Reason</h3>
      <p className={styles.modalSubText}>Please tell the user why you are rejecting this request.</p>
      
      <textarea 
        className={styles.reasonInput}
        placeholder="Type your reason here (e.g., Not available at this time, Slot already booked elsewhere...)"
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
      />

      <div className={styles.modalActions}>
        <button 
          className={styles.confirmRejectBtn} 
          onClick={submitRejection}
          disabled={!rejectionReason.trim()}
        >
          Confirm Reject
        </button>
        <button className={styles.cancelBtn} onClick={() => setShowRejectModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default ExpertHome;