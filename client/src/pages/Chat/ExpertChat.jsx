import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Chat.module.css'; 
import { FaVideo, FaPaperPlane, FaArrowLeft, FaRegCalendarAlt, FaClock, FaUserAlt, FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExpertChat = () => {
  const navigate = useNavigate();
  const [expert] = useState(JSON.parse(localStorage.getItem('user')));
  const [paidUsers, setPaidUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showSlotModal, setShowSlotModal] = useState(false); 

  useEffect(() => {
    fetchPaidUsers();
  }, []);

  const fetchPaidUsers = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/booking/get-expert-chat-users', { expertId: expert._id });
      if (res.data.success) {
        setPaidUsers(res.data.bookings);
      }
    } catch (error) {
      console.log("Error fetching paid users", error);
    }
  };

  const handleVideoClick = () => {
    if (selectedUser.isVideoActive) {
      window.open(`https://meet.jit.si/ExpertConnect_${selectedUser._id}`, '_blank');
    } else {
      alert(`Session Not Active!\nYour video session will be active on ${selectedUser.day} from ${selectedUser.slot.startTime} to ${selectedUser.slot.endTime}`);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { text: inputText, sender: 'expert' }]);
    setInputText("");
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
            <h3>Consultations</h3>
          </div>
          <div className={styles.expertList}>
            {paidUsers.length > 0 ? (
              paidUsers.map((item, index) => (
                <div 
                  key={index} 
                  className={`${styles.expertCard} ${selectedUser?._id === item._id ? styles.activeCard : ''}`}
                  onClick={() => setSelectedUser(item)}
                >
                  <img src={item.userId?.image || 'https://via.placeholder.com/50'} alt="User" className={styles.sidebarProfilePic} />
                  <div className={styles.expertInfo}>
                    <h4>{item.userId?.name}</h4>
                    <p>{item.userId?.specialization}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noExperts}>No paid consultations found.</p>
            )}
          </div>
        </div>

        <div className={styles.mainChat}>
          {selectedUser ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.headerLeft}>
                  <img src={selectedUser.userId?.image} alt="Profile" className={styles.headerProfilePic} />
                  <div>
                    <h4>{selectedUser.userId?.name}</h4>
                    <span className={selectedUser.isVideoActive ? styles.active : styles.notActive}>
                      {selectedUser.isVideoActive ? '● Active' : '● Session Not Active'}
                    </span>
                  </div>
                </div>
                <div className={styles.headerRight}>
                  <button className={styles.slotBtn} onClick={() => setShowSlotModal(true)}>
                    Slot Details
                  </button>
                  <FaVideo 
                    className={`${styles.videoIcon} ${!selectedUser.isVideoActive ? styles.disabled : ''}`} 
                    onClick={handleVideoClick}
                  />
                </div>
              </div>

              <div className={styles.messageArea}>
                {messages.length === 0 && <p className={styles.emptyChat}>Start conversation with {selectedUser.userId?.name}</p>}
                {messages.map((m, i) => (
                  <div key={i} className={styles.messageRow}>
                    <p className={m.sender === 'expert' ? styles.sent : styles.received}>{m.text}</p>
                  </div>
                ))}
              </div>
              <form className={styles.inputArea} onSubmit={handleSendMessage}>
                <input type="text" placeholder="Type here..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <button type="submit"><FaPaperPlane /></button>
              </form>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a User to start chat</p>
            </div>
          )}
        </div>
      </div>

      {/* --- Slot Details Modal --- */}
      {showSlotModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
               <img src={selectedUser.userId?.image} alt="User" className={styles.modalImg} />
               <h3>Appointment Slot</h3>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}><FaUserAlt /> <span><strong>Name:</strong> {selectedUser.userId?.name}</span></div>
              <div className={styles.detailRow}><FaBriefcase /> <span><strong>Specialization:</strong> {selectedUser.userId?.specialization || 'N/A'}</span></div>
              <div className={styles.detailRow}><FaRegCalendarAlt /> <span><strong>Date:</strong> {selectedUser.day}</span></div>
              <div className={styles.detailRow}><FaClock /> <span><strong>Time:</strong> {selectedUser.slot.startTime} - {selectedUser.slot.endTime}</span></div>
            </div>
            <button className={styles.doneBtn} onClick={() => setShowSlotModal(false)}>Done</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertChat;