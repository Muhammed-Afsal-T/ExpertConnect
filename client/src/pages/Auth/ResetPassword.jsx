import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../Login/Login.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // വാലിഡേഷൻ
    if (password.length < 8 || password.length > 12) {
      setError("Password must be 8-12 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/v1/user/reset-password/${id}/${token}`, { password });
      
      if (res.data.success) {
        alert("Password updated successfully! Please login.");
        navigate('/login');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError("Invalid or expired link. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>Enter your new password below.</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>New Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showPass ? "text" : "password"} 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <span className={styles.eyeIcon} onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm New Password</label>
            <div className={styles.passwordWrapper}>
              <input 
                type={showConfirmPass ? "text" : "password"} 
                placeholder="********" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
              <span className={styles.eyeIcon} onClick={() => setShowConfirmPass(!showConfirmPass)}>
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? "Updating..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;