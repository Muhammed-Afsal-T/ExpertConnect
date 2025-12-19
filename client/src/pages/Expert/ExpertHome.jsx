import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './ExpertHome.module.css';
import { FaCalendarCheck, FaWallet, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExpertHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
  }, []);

  const stats = {
    totalBookings: 0,
    totalEarnings: 0,
    todayMeetings: 0
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Welcome Section */}
        <div className={styles.header}>
          <h1>Welcome, {user?.name || 'Expert'}!</h1>
          
          {/* Verification Status Banner */}
          {!user?.isVerified ? (
            <div className={styles.pendingBanner}>
              <FaExclamationTriangle /> 
              <span>Your profile is under review. Complete your profile to get verified.</span>
              <button onClick={() => navigate('/expert/profile')} className={styles.completeBtn}>
                Complete Profile
              </button>
            </div>
          ) : (
            <div className={styles.verifiedBanner}>
              <span>Verified Professional Account</span>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.iconBox}><FaCalendarCheck /></div>
            <div className={styles.statInfo}>
              <h3>{stats.totalBookings}</h3>
              <p>Total Bookings</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.iconBox}><FaWallet /></div>
            <div className={styles.statInfo}>
              <h3>₹{stats.totalEarnings}</h3>
              <p>Total Earnings</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.iconBox}><FaClock /></div>
            <div className={styles.statInfo}>
              <h3>{stats.todayMeetings}</h3>
              <p>Today's Meetings</p>
            </div>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className={styles.requestsSection}>
          <h2>New Consultation Requests</h2>
          <div className={styles.requestList}>
            <p className={styles.noDataText}>No new requests at the moment.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertHome;