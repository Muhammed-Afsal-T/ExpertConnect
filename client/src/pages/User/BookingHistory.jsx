import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './BookingHistory.module.css';
import { useNavigate } from 'react-router-dom';

const BookingHistory = () => {
  const [history, setHistory] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState({ bookingId: '', expertId: '', reason: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/booking/user-history/${user._id}`);
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching history:", error);
    }
  };

  const handleReportSubmit = async () => {
    if (!reportData.reason.trim()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/v1/booking/report-expert', {
        ...reportData, 
        userId: user._id
      });
      if (res.data.success) {
        alert("Report Sent to Admin!");
        setShowReportModal(false);
        setReportData({ bookingId: '', expertId: '', reason: '' }); // ക്ലിയർ ചെയ്യുന്നു
      }
    } catch (error) {
      alert("Reporting failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.historyContainer}>
        <h2>Your Consultation History</h2>
        
        {history.length === 0 ? (
          <p className={styles.noHistory}>No consultation history found.</p>
        ) : (
          <div className={styles.historyGrid}>
            {history.map((item) => (
              <div key={item._id} className={styles.historyCard}>
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
                <div className={styles.actions}>
                  <button 
                    onClick={() => navigate(`/book-expert/${item.expertId._id}`)} 
                    className={styles.profileBtn}
                  >
                    View Profile
                  </button>
                  <button 
                    onClick={() => {
                      setReportData({ bookingId: item._id, expertId: item.expertId._id, reason: '' });
                      setShowReportModal(true);
                    }} 
                    className={styles.reportBtn}
                  >
                    Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                style={{ opacity: !reportData.reason.trim() ? 0.5 : 1, cursor: !reportData.reason.trim() ? 'not-allowed' : 'pointer' }}
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
    </>
  );
};

export default BookingHistory;