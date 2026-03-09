import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './BookingHistory.module.css';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import { toastError, toastSuccess} from '../../utils/alert';

const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  const [reportData, setReportData] = useState({ bookingId: '', expertId: '', reason: '' });
  const [reviewData, setReviewData] = useState({ bookingId: '', expertId: '', rating: 0, message: '' });
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    // Initial history fetch on first render.
    fetchHistory();
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchHistory(page);
      window.scrollTo({ top: 0, behavior: 'smooth' }); //
    }
    }, [page]);

  const fetchHistory = async (currentPage = 1) => {
  try {
    // Pull paginated history limited to closed/completed booking states.
    const res = await axios.get(`https://expertconnect-backend-3hhu.onrender.com/api/v1/booking/user-history/${user._id}`, {
      params: { page: currentPage, limit: 21 }
    });
    if (res.data.success) {
      setHistory(res.data.data);
      setTotalPages(res.data.totalPages);
    }
  } catch (error) {
    console.log("Error fetching history:", error);
  }
};

  useEffect(() => {
  fetchHistory(page);
  }, [page]);

  const handleReportSubmit = async () => {
    // Report is stored against booking for admin moderation.
    if (!reportData.reason.trim()) return;
    try {
      const res = await axios.post('https://expertconnect-backend-3hhu.onrender.com/api/v1/booking/report-expert', {
        ...reportData, 
        userId: user._id
      });
      if (res.data.success) {
        toastSuccess("Report Sent to Admin!");
        setShowReportModal(false);
        setReportData({ bookingId: '', expertId: '', reason: '' });
        fetchHistory();
      }
    } catch (error) {
      toastError("Reporting failed.");
    }
  };

  const handleReviewSubmit = async () => {
    // Submit post-session rating/feedback for selected expert.
    try {
      const res = await axios.post('https://expertconnect-backend-3hhu.onrender.com/api/v1/review/post-review', {
        ...reviewData,
        userId: user._id,
        userName: user.name
      });
      if (res.data.success) {
        toastSuccess("Your review has been recorded!");
        setShowReviewModal(false);
        setReviewData({ bookingId: '', expertId: '', rating: 0, message: '' });
        fetchHistory();
      }
    } catch (error) {
      toastError("Could not submit the review.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.historyContainer}>
        <div className={styles.backBtn} onClick={() => navigate('/profile')}>
          <FaArrowLeft /> Back
          </div>
        <h2>Your Consultation History</h2>
        
        {history.length === 0 ? (
          <p className={styles.noHistory}>No consultation history found.</p>
        ) : (
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <div key={item._id} className={`${styles.historyCard} ${styles[item.status]}`}>
                <div className={styles.statusHeader}>
                  <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                    {item.status.toUpperCase()}
                  </span>
                  <span className={item.status === 'completed' ? styles.paidBadge : styles.unpaidBadge}>
                    {item.status === 'completed' ? 'PAID' : 'UNPAID'}
                  </span>
                </div>

                <div className={styles.expertInfo}>
                  <img 
                    src={item.expertId?.image || 'https://via.placeholder.com/50'} 
                    alt="Expert" 
                  />
                  <div>
                    <h4>{item.expertId?.name}</h4>
                    <p>{item.expertId?.specialization}</p>
                  </div>
                </div>
                <hr />
                <div className={styles.sessionDetails}>
                  <p><strong>Date:</strong> {item.day}</p>
                  <p><strong>Time:</strong> {item.slot.startTime} - {item.slot.endTime}</p>
                  <p><strong>Price:</strong> ₹{item.amount}</p>
                </div>

                {/* Showing rejection message */}
                {item.status === 'rejected' && item.rejectionReason && (
                  <div className={styles.rejectionBox}>
                    <FaInfoCircle /> <strong>Reason:</strong> {item.rejectionReason}
                  </div>
                )}

                <div className={styles.actions}>
                  <button 
                    onClick={() => navigate(`/book-expert/${item.expertId._id}`)} 
                    className={styles.profileBtn}
                  >
                    View Profile
                  </button>

                  {/* Review/report actions are available only after completion. */}
                  {item.status === 'completed' && (
                    <>
                      {!item.isReviewed && (
                        <button 
                          onClick={() => {
                            setReviewData({ ...reviewData, bookingId: item._id, expertId: item.expertId._id });
                            setShowReviewModal(true);
                          }} 
                          className={styles.rateBtn}
                        >
                          Rate
                        </button>
                      )}

                      {!item.isReported && (
                        <button 
                          onClick={() => {
                            setReportData({ bookingId: item._id, expertId: item.expertId._id, reason: '' });
                            setShowReportModal(true);
                          }} 
                          className={styles.reportBtn}
                        >
                          Report
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Rate Your Experience</h3>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar 
                  key={star}
                  className={styles.star}
                  color={reviewData.rating >= star ? "#ffc107" : "#e4e5e9"}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                />
              ))}
            </div>
            <textarea 
              placeholder="Write your feedback here..." 
              value={reviewData.message}
              onChange={(e) => setReviewData({ ...reviewData, message: e.target.value })}
            />
            <div className={styles.modalActions}>
              {/* Validation: Disable if rating is 0 or message is empty */}
              <button 
                onClick={handleReviewSubmit} 
                className={styles.submitBtn}
                disabled={reviewData.rating === 0 || !reviewData.message.trim()}
                style={{
                  opacity: (reviewData.rating === 0 || !reviewData.message.trim()) ? 0.5 : 1,
                  cursor: (reviewData.rating === 0 || !reviewData.message.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                Submit Review
              </button>
              <button onClick={() => setShowReviewModal(false)} className={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Report Issue</h3>
            <p style={{fontSize: '13px', color: '#666'}}>Tell us what went wrong during your session.</p>
            <textarea 
              placeholder="Please provide details about the issue..." 
              value={reportData.reason}
              onChange={(e) => setReportData({ ...reportData, reason: e.target.value })}
            />
            <div className={styles.modalActions}>
              <button 
                onClick={handleReportSubmit} 
                className={styles.submitBtn}
                disabled={!reportData.reason.trim()}
                style={{
                    opacity: !reportData.reason.trim() ? 0.5 : 1,
                    cursor: !reportData.reason.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Submit Report
              </button>
              <button onClick={() => setShowReportModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {totalPages > 1 && (
  <div className={styles.pagination}>
    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>Prev</button>
    <span className={styles.pageInfo}>Page <strong>{page}</strong> of {totalPages}</span>
    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next</button>
  </div>
   )}
    </>
  );
};

export default BookingHistory;
