import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './ExpertDetails.module.css';
import { FaArrowLeft, FaCheckCircle, FaStar, FaRegClock, FaCalendarAlt } from 'react-icons/fa';

const ExpertDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("idle");
  const [bookedSlots, setBookedSlots] = useState([]); 

  useEffect(() => {
    const fetchExpertAndBookings = async () => {
      try {
        const expertRes = await axios.post('http://localhost:5000/api/v1/user/getUserData', { userId: id });
        if (expertRes.data.success) {
          setExpert(expertRes.data.data);
        }

        const bookingsRes = await axios.post('http://localhost:5000/api/v1/booking/get-expert-bookings', { expertId: id });
        if (bookingsRes.data.success) {
          const accepted = bookingsRes.data.data.filter(b => b.status === 'accepted');
          setBookedSlots(accepted);
        }

        const statusRes = await axios.post('http://localhost:5000/api/v1/booking/check-status', {
          userId: user._id, expertId: id
        });
        if (statusRes.data.isPending) {
          setBookingStatus("pending");
          setSelectedSlot(statusRes.data.data.slot);
          const dateMatch = expertRes.data.data.availability.find(a => a.date === statusRes.data.data.day);
          setSelectedDateObj(dateMatch);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpertAndBookings();
  }, [id, user._id]);

  const isSlotBooked = (date, startTime) => {
    return bookedSlots.some(b => b.day === date && b.slot.startTime === startTime);
  };

  const handleBooking = async () => {
    if (!selectedDateObj || !selectedSlot) return alert("Select Date and Slot!");
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/v1/booking/book-expert', {
        userId: user._id, expertId: id, day: selectedDateObj.date, slot: selectedSlot, amount: expert.fees
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
      const res = await axios.post('http://localhost:5000/api/v1/booking/cancel-booking', { userId: user._id, expertId: id });
      if (res.data.success) {
        alert(res.data.message);
        setBookingStatus("idle");
        setSelectedDateObj(null);
        setSelectedSlot(null);
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
          <FaArrowLeft /> Back
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.infoSection}>
            <div className={styles.profileHeader}>
              <img src={expert.image} alt={expert.name} className={styles.profilePic} />
              <div className={styles.nameSection}>
                <h2>{expert.name} <FaCheckCircle className={styles.verifyIcon} /></h2>
                <p className={styles.spec}>{expert.specialization}</p>
                <div className={styles.rating}>
                  <FaStar className={styles.star} /> {expert.numReviews > 0 ? expert.averageRating.toFixed(1) : "No Ratings"}
                </div>
              </div>
            </div>

            <div className={styles.detailsContent}>
              {/* --- ഇതാ ഇവിടെയാണ് മാറ്റം വരുത്തിയിരിക്കുന്നത് --- */}
              <div className={styles.detailRow}>
                <span><strong>Email:</strong> {expert.email}</span>
                <span><strong>Age:</strong> {expert.age} Years</span>
              </div>
              <div className={styles.detailRow}>
                <span><strong>Experience:</strong> {expert.experience} Years</span>
                <span><strong>Fees:</strong> ₹{expert.fees} / session</span>
              </div>
              {/* ------------------------------------------ */}
              
              <div className={styles.aboutBox}>
                <h3>About</h3>
                <p>{expert.about || "Professional expert in " + expert.specialization}</p>
              </div>
              <button className={styles.reviewBtn}>Read Reviews</button>
            </div>
          </div>

          <div className={styles.bookingSection}>
            <h3><FaCalendarAlt /> Select Date</h3>
            <div className={styles.daysGrid}>
              {expert.availability?.length > 0 ? (
                expert.availability.map((item, index) => (
                  <div 
                    key={index} 
                    className={`${styles.dayBox} ${selectedDateObj?.date === item.date ? styles.activeDay : ''}`}
                    onClick={() => bookingStatus === "idle" && (setSelectedDateObj(item), setSelectedSlot(null))}
                  >
                    {item.date}
                  </div>
                ))
              ) : (
                <p className={styles.noDataText}>No upcoming dates available.</p>
              )}
            </div>

            {selectedDateObj && (
              <>
                <h3 style={{marginTop: '25px'}}><FaRegClock /> Available Slots</h3>
                <div className={styles.slotGrid}>
                  {selectedDateObj.slots.map((slot, index) => {
                    const booked = isSlotBooked(selectedDateObj.date, slot.startTime);
                    return (
                      <div 
                        key={index} 
                        className={`
                          ${styles.slotBox} 
                          ${selectedSlot?.startTime === slot.startTime ? styles.activeSlot : ''} 
                          ${booked ? styles.bookedSlot : ''}
                        `}
                        onClick={() => !booked && bookingStatus === "idle" && setSelectedSlot(slot)}
                      >
                        {booked ? "Already Booked" : `${slot.startTime} - ${slot.endTime}`}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className={styles.actionArea}>
              {bookingStatus === "idle" ? (
                <button className={styles.confirmBtn} disabled={!selectedSlot || loading} onClick={handleBooking}>
                  {loading ? "Processing..." : "Confirm Booking"}
                </button>
              ) : (
                <div className={styles.statusBox}>
                   <button className={styles.pendingBtn} disabled>Request Pending</button>
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