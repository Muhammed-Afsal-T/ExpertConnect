import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Chat.module.css';
import { FaVideo, FaPaperPlane, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [experts, setExperts] = useState([]); 
  const [selectedExpert, setSelectedExpert] = useState(null); 
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAcceptedExperts();
  }, []);

  const fetchAcceptedExperts = async () => {
    try {
        const res = await axios.post('http://localhost:5000/api/v1/booking/get-user-active-bookings', { userId: user._id });
        if (res.data.success) {
            setExperts(res.data.bookings);
        }
    } catch (error) {
        console.log("Chat fetch error:", error);
    }
  };

  // --- Razorpay Integration ---
  const handleRazorpayPayment = async () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onerror = () => alert('Razorpay SDK failed to load.');
    script.onload = async () => {
      try {
        setLoading(true);
        const options = {
          key: "YOUR_RAZORPAY_KEY_ID", // ഇവിടെ നിങ്ങളുടെ Test Key നൽകുക
          amount: selectedExpert.amount * 100, 
          currency: "INR",
          name: "ExpertConnect",
          description: `Consultation with ${selectedExpert.expertId?.name}`,
          handler: async function (response) {
            const res = await axios.post('http://localhost:5000/api/v1/booking/update-payment-status', { 
              bookingId: selectedExpert._id 
            });
            if (res.data.success) {
              alert("Payment Successful! Session Unlocked.");
              setShowPaymentModal(false);
              fetchAcceptedExperts();
              setSelectedExpert({ ...selectedExpert, status: 'paid' });
            }
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: "#0056b3" },
        };
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  const handleVideoClick = () => {
    if (selectedExpert.isVideoActive) {
      window.open(`https://meet.jit.si/ExpertConnect_${selectedExpert._id}`, '_blank');
    } else {
      alert(`Session Not Active!\nYour video session will be active on ${selectedExpert.day} from ${selectedExpert.slot.startTime} to ${selectedExpert.slot.endTime}`);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    setInputText("");
  };

  return (
    <>
      <Navbar />
      <div className={styles.chatContainer}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.backAction} onClick={() => navigate(-1)}>
              <FaArrowLeft /> <span>Back</span>
            </div>
            <h3>Messages</h3>
          </div>
          <div className={styles.expertList}>
            {experts.length > 0 ? (
              experts.map((item, index) => (
                <div 
                  key={index} 
                  className={`${styles.expertCard} ${selectedExpert?._id === item._id ? styles.activeCard : ''}`}
                  onClick={() => setSelectedExpert(item)}
                >
                  <img src={item.expertId?.image || 'https://via.placeholder.com/50'} alt="Expert" className={styles.sidebarProfilePic} />
                  <div className={styles.expertInfo}>
                    <h4>{item.expertId?.name} <FaCheckCircle className={styles.verified} /></h4>
                    <p>{item.expertId?.specialization}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noExperts}>No active consultations found.</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={styles.mainChat}>
          {selectedExpert ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.headerLeft}>
                  <img src={selectedExpert.expertId?.image} alt="Profile" className={styles.headerProfilePic} />
                  <div>
                    <h4>{selectedExpert.expertId?.name}</h4>
                    <span className={selectedExpert.isVideoActive ? styles.active : styles.notActive}>
                      {selectedExpert.isVideoActive ? '● Active' : '● Session Not Active'}
                    </span>
                  </div>
                </div>
                <div className={styles.headerRight}>
                  <button className={styles.slotBtn} onClick={() => navigate(`/book-expert/${selectedExpert.expertId?._id}`)}>
                    Your Slot
                  </button>
                  
                  {/* --- മാറ്റം: Paid ആണെങ്കിൽ മാത്രം വീഡിയോ ഐക്കൺ കാണിക്കുന്നു --- */}
                  {selectedExpert.status === 'paid' && (
                    <FaVideo 
                      className={`${styles.videoIcon} ${!selectedExpert.isVideoActive ? styles.disabled : ''}`} 
                      onClick={handleVideoClick}
                    />
                  )}
                </div>
              </div>

              {selectedExpert.status === 'accepted' ? (
                <div className={styles.paymentPrompt}>
                  <div className={styles.promptBox}>
                    <p>Please pay to proceed and unlock chat/video features.</p>
                    <button className={styles.payBtn} onClick={() => setShowPaymentModal(true)}>
                      Pay ₹{selectedExpert.amount}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.messageArea}>
                    {messages.length === 0 && <p className={styles.emptyChat}>No messages yet. Start conversation...</p>}
                    {messages.map((m, i) => (
                      <div key={i} className={styles.messageRow}>
                        <p className={m.sender === 'user' ? styles.sent : styles.received}>{m.text}</p>
                      </div>
                    ))}
                  </div>
                  <form className={styles.inputArea} onSubmit={handleSendMessage}>
                    <input type="text" placeholder="Type here..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
                    <button type="submit"><FaPaperPlane /></button>
                  </form>
                </>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select an Expert to start consultation</p>
            </div>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <div className={styles.modalOverlay}>
           <div className={styles.modalContent}>
              <h3>Complete Your Payment</h3>
              <p>Expert: {selectedExpert?.expertId?.name}</p>
              <p className={styles.amountText}>Amount: ₹{selectedExpert?.amount}</p>
              <button className={styles.finalPayBtn} disabled={loading} onClick={handleRazorpayPayment}>
                {loading ? "Initializing..." : "Pay Now"}
              </button>
              <button className={styles.closeBtn} onClick={() => setShowPaymentModal(false)}>Cancel</button>
           </div>
        </div>
      )}
    </>
  );
};

export default Chat;