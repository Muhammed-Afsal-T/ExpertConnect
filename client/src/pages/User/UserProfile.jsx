import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './UserProfile.module.css';
import { FaArrowLeft, FaCamera, FaHistory } from 'react-icons/fa';
const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userId: user?._id,
    name: user?.name,
    email: user?.email,
    age: user?.age || '',
    gender: user?.gender || '',
    specialization: user?.specialization || '' // Profession
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.image || '');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/api/v1/user/updateProfile', data);
      if (res.data.success) {
        alert("Profile Updated Successfully!");
        localStorage.setItem('user', JSON.stringify(res.data.data));
        setUser(res.data.data);
        navigate('/user-dashboard');
      }
    } catch (error) {
      console.log(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.backBtn} onClick={() => navigate('/user-dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </div>

        <form onSubmit={handleSubmit} className={styles.profileCard}>
          <div className={styles.header}>
            <h2>My Profile</h2>
          </div>

          <div className={styles.profilePicSection}>
            <div className={styles.imageWrapper}>
              <img src={preview || 'https://via.placeholder.com/150'} alt="User" />
              <label className={styles.cameraBtn}>
                <FaCamera />
                <input type="file" onChange={handleFileChange} hidden />
              </label>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input type="text" value={formData.name} readOnly className={styles.readOnly} />
            </div>

          <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input type="email" value={formData.email} readOnly className={styles.readOnly} />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} min="13" max="100" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Profession / Interest</label>
              <input 
                type="text" 
                name="specialization" 
                value={formData.specialization} 
                onChange={handleChange} 
                placeholder="e.g. Student, Developer, Designer"
              />
            </div>

            <button 
            type="button" 
            className={styles.historyBtn} 
            onClick={() => navigate('/booking-history')}>
            <FaHistory /> View My Booking History
          </button>
          
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </>
  );
};

export default UserProfile;