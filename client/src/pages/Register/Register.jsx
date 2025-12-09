import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css'; 
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', 
  });

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Toggle (User vs Professional)
  const handleRoleChange = (role) => {
    setFormData({ ...formData, role: role });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/user/register', formData);
      
      if (res.data.success) {
        alert("Registration Successful!");
        navigate('/login'); // Redirect to login
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Create an Account</h2>
        
        {/* Toggle Switch for Role */}
        <div className={styles.toggleContainer}>
          <div 
            className={`${styles.toggleOption} ${formData.role === 'user' ? styles.active : ''}`}
            onClick={() => handleRoleChange('user')}
          >
            User
          </div>
          <div 
            className={`${styles.toggleOption} ${formData.role === 'expert' ? styles.active : ''}`}
            onClick={() => handleRoleChange('expert')}
          >
            Professional
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              placeholder="Arjun K" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="arjun@gmail.com" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="********" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className={styles.registerBtn}>REGISTER</button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link to="/login" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;