import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from "../Login/Login.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post('http://localhost:5000/api/v1/user/forgot-password', { email });
      
      if (res.data.success) {
        setMessage("Success! Please check your email for the reset link.");
        setTimer(300);
      } else {
        setMessage(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.log(error);
      setMessage("Error: Could not send reset link. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Forgot Password?</h2>
        <p className={styles.subtitle}>Enter your email address to receive a password reset link.</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your registered email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={timer > 0}
            />
          </div>

          {message && (
            <p className={message.includes("Success") ? styles.successText : styles.errorText}>
              {message}
            </p>
          )}

          {timer > 0 && (
            <p className={styles.timerText}>
              You can resend the link in: {formatTime(timer)}
            </p>
          )}

          <button 
            type="submit" 
            className={styles.loginBtn} 
            disabled={loading || timer > 0}
          >
            {loading ? "Sending..." : timer > 0 ? "PLEASE WAIT" : "SEND RESET LINK"}
          </button>
        </form>

        <p className={styles.footerText}>
          Remember your password? <Link to="/login" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;