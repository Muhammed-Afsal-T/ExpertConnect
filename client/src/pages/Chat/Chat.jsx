import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Chat.module.css';
import { FaVideo, FaPaperPlane, FaCheckCircle, FaArrowLeft, FaCalendarPlus, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client'; 

const socket = io.connect("http://localhost:5000");

const Chat = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(); 
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAcceptedExperts();
  }, []);

  // --- Socket.io Logic Start ---

  useEffect(() => {
    if (selectedExpert && selectedExpert.status === 'paid') {
      socket.emit("join_chat", selectedExpert._id); 
      fetchMessages();
    }
  }, [selectedExpert]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (selectedExpert && data.bookingId === selectedExpert._id) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [selectedExpert]);

  // --- Socket.io Logic End ---

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/message/get-messages/${selectedExpert._id}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  const handleMockPayment = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/v1/booking/update-payment-status', {
        bookingId: selectedExpert._id
      });
     
      if (res.data.success) {
        setPaymentSuccess(true); 
        fetchAcceptedExperts(); 
        setSelectedExpert({ ...selectedExpert, status: 'paid' });
      }
    } catch (error) {
      alert("Payment simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  const getGoogleCalendarLink = (item) => {
    const title = encodeURIComponent(`Consultation with ${item.expertId?.name}`);
    const details = encodeURIComponent(`ExpertConnect Session - Please be on time!`);
    const dateStr = item.day.replace(/-/g, "");
    const startTime = item.slot.startTime.replace(/:/g, "") + "00";
    const endTime = item.slot.endTime.replace(/:/g, "") + "00";
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}T${startTime}/${dateStr}T${endTime}`;
  };

  const handleVideoClick = () => {
    if (selectedExpert.isVideoActive) {
      window.open(`https://meet.jit.si/ExpertConnect_${selectedExpert._id}`, '_blank');
    } else {
      alert(`Session Not Active!\nYour video session will be active on ${selectedExpert.day} from ${selectedExpert.slot.startTime} to ${selectedExpert.slot.endTime}`);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const messageData = {
        bookingId: selectedExpert._id,
        sender: user._id,
        receiver: selectedExpert.expertId._id,
        message: inputText
      };

      const res = await axios.post('http://localhost:5000/api/v1/message/send-message', messageData);
      
      if (res.data.success) {
        socket.emit("send_message", res.data.newMessage);

        setMessages([...messages, res.data.newMessage]);
        setInputText("");
      }
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.chatContainer}>
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
                  onClick={() => {
                    setSelectedExpert(item);
                    setPaymentSuccess(false); 
                  }}
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
                      <div key={i} ref={scrollRef} className={styles.messageRow}>
                        <p className={m.sender === user._id ? styles.sent : styles.received}>
                          {m.message}
                        </p>
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
              {!paymentSuccess ? (
                <>
                  <div className={styles.modalHeader}>
                    <h3>Complete Your Payment</h3>
                  </div>
                  <div className={styles.modalBody}>
                    <p>Expert: <strong>{selectedExpert?.expertId?.name}</strong></p>
                    <p className={styles.amountText}>Amount: ₹{selectedExpert?.amount}</p>
                  </div>
                  <button className={styles.finalPayBtn} disabled={loading} onClick={handleMockPayment}>
                    {loading ? "Processing..." : "Pay Now"}
                  </button>
                  <button className={styles.closeBtn} onClick={() => setShowPaymentModal(false)}>Cancel</button>
                </>
              ) : (
                <div className={styles.successView}>
                  <div className={styles.checkIcon}><FaCheck /></div>
                  <h2>Payment Successful!</h2>
                  <p>Your session with {selectedExpert?.expertId?.name} is unlocked.</p>
                 
                  <div className={styles.reminderBox}>
                     <p>Don't miss your session! Add it to your calendar.</p>
                     <a
                        href={getGoogleCalendarLink(selectedExpert)}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.calendarLink}
                      >
                        <FaCalendarPlus /> Add to Google Calendar
                     </a>
                  </div>

                  <button className={styles.doneBtn} onClick={() => setShowPaymentModal(false)}>
                    Go to Chat
                  </button>
                </div>
              )}
           </div>
        </div>
      )}
    </>
  );
};

export default Chat;