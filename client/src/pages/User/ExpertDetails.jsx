import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './ExpertDetails.module.css';
import { FaArrowLeft, FaCheckCircle, FaStar, FaRegClock } from 'react-icons/fa';

const ExpertDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("");
  const [bookingStatus, setBookingStatus] = useState("idle");

  useEffect(() => {
    const fetchExpertAndStatus = async () => {
      try {
        // 1. എക്സ്പെർട്ട് ഡീറ്റെയിൽസ് എടുക്കുന്നു
        const expertRes = await axios.post('http://localhost:5000/api/v1/user/getUserData', { userId: id });
        if (expertRes.data.success) {
          setExpert(expertRes.data.data);
        }

        // 2. റിക്വസ്റ്റ് സ്റ്റാറ്റസ് ചെക്ക് ചെയ്യുന്നു
        const statusRes = await axios.post('http://localhost:5000/api/v1/booking/check-status', {
          userId: user._id,
          expertId: id
        });
        if (statusRes.data.isPending) {
          setBookingStatus("pending");
          setSelectedDay(statusRes.data.data.day); 
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpertAndStatus();
  }, [id, user._id]);

  const handleBooking = async () => {
    if (!selectedDay) return alert("Please select a day!");
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/v1/booking/book-expert', {
        userId: user._id,
        expertId: id,
        day: selectedDay,
        amount: expert.fees
      });
      if (res.data.success) {
        alert(res.data.message);
        setBookingStatus("pending");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/v1/booking/cancel-booking', {
        userId: user._id,
        expertId: id
      });
      if (res.data.success) {
        alert(res.data.message);
        setBookingStatus("idle");
        setSelectedDay("");
      }
    } catch (error) {
      alert("Cancellation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !expert) return <div className={styles.loader}>Loading...</div>;
  if (!expert) return <div className={styles.error}>Expert not found.</div>;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.backBtn} onClick={() => navigate('/user-dashboard')}>
          <FaArrowLeft /> Back to Experts
        </div>

        <div className={styles.mainGrid}>
          {/* Left Side: Expert Info */}
          <div className={styles.infoSection}>
            <div className={styles.profileHeader}>
              <img src={expert.image} alt={expert.name} className={styles.profilePic} />
              <div className={styles.nameSection}>
                <h2>{expert.name} <FaCheckCircle className={styles.verifyIcon} title="Verified Expert" /></h2>
                <p className={styles.spec}>{expert.specialization}</p>
                <div className={styles.rating}>
                  <FaStar className={styles.star} /> {expert.numReviews > 0 ? expert.averageRating.toFixed(1) : "No Ratings"}
                </div>
              </div>
            </div>

            <div className={styles.detailsContent}>
              <div className={styles.detailRow}>
                <span><strong>Email:</strong> {expert.email}</span>
                <span><strong>Age:</strong> {expert.age} Years</span>
              </div>
              <div className={styles.detailRow}>
                <span><strong>Experience:</strong> {expert.experience} Years</span>
                <span><strong>Fees:</strong> ₹{expert.fees} /hr</span>
              </div>
              
              <div className={styles.aboutBox}>
                <h3>About</h3>
                <p>{expert.about || "Professional expert in " + expert.specialization}</p>
              </div>

              {/* വായനക്കാർക്ക് റിവ്യൂ കാണാനുള്ള ബട്ടൺ ഇവിടെയുണ്ട് */}
              <button className={styles.reviewBtn}>Read Reviews</button>
            </div>
          </div>

          {/* Right Side: Availability & Booking */}
          <div className={styles.bookingSection}>
            <h3>Choose a Day</h3>
            <div className={styles.daysGrid}>
              {expert.availableDays?.map(day => (
                <div 
                  key={day} 
                  className={`${styles.dayBox} ${selectedDay === day ? styles.activeDay : ''}`}
                  onClick={() => bookingStatus === "idle" && setSelectedDay(day)}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className={styles.timeInfo}>
              <FaRegClock /> Available: <strong>{expert.startTime} - {expert.endTime}</strong>
            </div>

            <div className={styles.actionArea}>
              {bookingStatus === "idle" ? (
                <button 
                  className={styles.confirmBtn} 
                  disabled={!selectedDay || loading}
                  onClick={handleBooking}
                >
                  {loading ? "Processing..." : "Confirm Request"}
                </button>
              ) : (
                <div className={styles.statusBox}>
                   <button className={styles.pendingBtn} disabled>Request Sent (Pending)</button>
                   <button className={styles.cancelBtn} onClick={handleCancel}>Cancel Request</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertDetails;