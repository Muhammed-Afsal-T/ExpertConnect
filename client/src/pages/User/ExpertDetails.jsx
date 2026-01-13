import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './ExpertDetails.module.css';
import { FaArrowLeft, FaCheckCircle, FaStar, FaRegClock, FaCalendarAlt, FaComments, FaCheck } from 'react-icons/fa';

const ExpertDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [userBookings, setUserBookings] = useState([]); 
  const [showCalendarOverride, setShowCalendarOverride] = useState(false); 
  const [bookedSlots, setBookedSlots] = useState([]); 

  useEffect(() => {
    fetchExpertAndBookings();
  }, [id, user._id]);

  const fetchExpertAndBookings = async () => {
    try {
      const expertRes = await axios.post('http://localhost:5000/api/v1/user/getUserData', { userId: id });
      if (expertRes.data.success) {
        setExpert(expertRes.data.data);
      }

      // എക്സ്പെർട്ടിന്റെ മൊത്തം ബുക്കിംഗുകൾ (Slot Protection നുവേണ്ടി)
      const bookingsRes = await axios.post('http://localhost:5000/api/v1/booking/get-expert-bookings', { expertId: id });
      if (bookingsRes.data.success) {
        const accepted = bookingsRes.data.data.filter(b => b.status === 'accepted');
        setBookedSlots(accepted);
      }

      // ഈ യൂസറുടെ ബുക്കിംഗ് സ്റ്റാറ്റസ് ചെക്ക് ചെയ്യുന്നു
      const statusRes = await axios.post('http://localhost:5000/api/v1/booking/check-status', {
        userId: user._id, expertId: id
      });
      if (statusRes.data.success) {
        setUserBookings(statusRes.data.bookings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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
        setShowCalendarOverride(false); 
        fetchExpertAndBookings();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/v1/booking/cancel-booking', { userId: user._id, expertId: id });
      alert("Request Cancelled");
      fetchExpertAndBookings();
    } catch (error) {
      alert("Cancellation failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !expert) return <div className={styles.loader}>Loading...</div>;
  if (!expert) return <div className={styles.error}>Expert not found.</div>;

  const hasActiveBookings = userBookings.length > 0;

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
              <div className={styles.detailRow}>
                <span><strong>Email:</strong> {expert.email}</span>
                <span><strong>Age:</strong> {expert.age} Years</span>
              </div>
              <div className={styles.detailRow}>
                <span><strong>Experience:</strong> {expert.experience} Years</span>
                <span><strong>Fees:</strong> ₹{expert.fees} / session</span>
              </div>
              <div className={styles.aboutBox}>
                <h3>About</h3>
                <p>{expert.about || "Professional expert in " + expert.specialization}</p>
              </div>
              <button className={styles.reviewBtn}>Read Reviews</button>
            </div>
          </div>

          <div className={styles.bookingSection}>
            {hasActiveBookings && !showCalendarOverride ? (
              <div className={styles.statusView}>
                <h3 className={styles.statusTitle}>Your Appointment Status</h3>
                
                <div className={styles.bookingList}>
                  {userBookings.map((b, index) => (
                    <div key={index} className={`${styles.statusCard} ${styles[b.status]}`}>
                      <div className={styles.statusHeader}>
                         <span className={styles.dateLabel}>{b.day}</span>
                         <span className={styles.statusBadge}>{b.status.toUpperCase()}</span>
                      </div>
                      <p className={styles.slotDetails}><FaRegClock /> {b.slot.startTime} - {b.slot.endTime}</p>
                      
                      {(b.status === 'accepted' || b.status === 'paid') ? (
                        <div className={styles.successMsg}>
                          <p><FaCheck /> Your slot is ready for the next process.</p>
                          <button className={styles.chatLinkBtn} onClick={() => navigate('/chat')}>
                             <FaComments /> Navigate to Chat
                          </button>
                        </div>
                      ) : (
                        <div className={styles.pendingMsg}>
                          <p>Waiting for expert's approval...</p>
                          <button className={styles.miniCancel} onClick={() => handleCancel(b._id)}>Cancel Request</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.anotherRequestArea}>
                   <p>Do you want another request?</p>
                   <button className={styles.linkButton} onClick={() => setShowCalendarOverride(true)}>
                      Click here to select another slot
                   </button>
                </div>
              </div>
            ) : (
              <div className={styles.calendarView}>
                <div className={styles.calendarHeader}>
                  <h3><FaCalendarAlt /> Select Date</h3>
                  {hasActiveBookings && (
                    <button className={styles.viewStatusBtn} onClick={() => setShowCalendarOverride(false)}>
                      View Status
                    </button>
                  )}
                </div>

                <div className={styles.daysGrid}>
                  {expert.availability?.length > 0 ? (
                    expert.availability.map((item, index) => (
                      <div 
                        key={index} 
                        className={`${styles.dayBox} ${selectedDateObj?.date === item.date ? styles.activeDay : ''}`}
                        onClick={() => setSelectedDateObj(item)}
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
                    <h3 style={{marginTop: '25px'}}><FaRegClock /> Available Slots <span style={{ fontWeight: '300', fontSize: '0.9em', opacity: 0.7 }}>(24 Hour Format)</span></h3>
                    <div className={styles.slotGrid}>
                      {selectedDateObj.slots.map((slot, index) => {
                        const booked = isSlotBooked(selectedDateObj.date, slot.startTime);
                        return (
                          <div 
                            key={index} 
                            className={`${styles.slotBox} ${selectedSlot?.startTime === slot.startTime ? styles.activeSlot : ''} ${booked ? styles.bookedSlot : ''}`}
                            onClick={() => !booked && setSelectedSlot(slot)}
                          >
                            {booked ? "Already Booked" : `${slot.startTime} - ${slot.endTime}`}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className={styles.actionArea}>
                  <button className={styles.confirmBtn} disabled={!selectedSlot || loading} onClick={handleBooking}>
                    {loading ? "Processing..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpertDetails;