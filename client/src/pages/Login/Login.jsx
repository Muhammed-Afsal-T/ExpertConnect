import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/v1/user/login', formData);
      
      if (res.data.success) {
        // Token ബ്രൗസറിൽ സേവ് ചെയ്യുന്നു
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        alert("Login Successful!");
        
        // റോൾ അനുസരിച്ച് അതാത് പേജിലേക്ക് വിടുന്നു
        if(res.data.user.role === 'admin') navigate('/admin');
        else if(res.data.user.role === 'expert') navigate('/expert-dashboard');
        else navigate('/user-dashboard'); // സാധാരണ യൂസർ
        
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
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Login to continue to ExpertConnect</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Enter your password" 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className={styles.loginBtn}>LOGIN</button>
        </form>

        <p className={styles.footerText}>
          Don't have an account? <Link to="/register" className={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;