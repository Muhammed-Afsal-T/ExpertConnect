import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './ExpertProfile.module.css';
import { FaArrowLeft, FaCamera } from 'react-icons/fa';

const ExpertProfile = () => {
  const navigate = useNavigate();
  // ലോക്കൽ സ്റ്റോറേജിൽ നിന്ന് യൂസറെ എടുക്കുന്നു
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(false);

  // ഫോം ഡാറ്റ സെറ്റ് ചെയ്യുന്നു (നിലവിലുള്ള വിവരങ്ങൾ ഉണ്ടെങ്കിൽ അത് കാണിക്കും)
  const [formData, setFormData] = useState({
    userId: user?._id,
    name: user?.name,
    email: user?.email,
    age: user?.age || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    fees: user?.fees || '',
    about: user?.about || '',
    availableDays: user?.availableDays || [], // ഡാറ്റാബേസിൽ നിന്നുള്ള ദിവസങ്ങൾ
    startTime: user?.startTime || '',          // ബാക്കെൻഡിൽ നിന്നുള്ള സമയം
    endTime: user?.endTime || ''
  });

  const [files, setFiles] = useState({
    image: null,
    certificates: null,
    idProof: null
  });

  const [previews, setPreviews] = useState({
    image: user?.image || '',
    certificates: user?.certificates || '',
    idProof: user?.idProof || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFiles({ ...files, [e.target.name]: file });
    setPreviews({ ...previews, [e.target.name]: URL.createObjectURL(file) });
  };

  const handleDayChange = (day) => {
    const updatedDays = formData.availableDays.includes(day)
      ? formData.availableDays.filter(d => d !== day)
      : [...formData.availableDays, day];
    setFormData({ ...formData, availableDays: updatedDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();

    // ഫോം ഡാറ്റ ആഡ് ചെയ്യുന്നു
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        data.append(key, formData[key].join(',')); // ദിവസങ്ങൾ കോമ ഇട്ട് അയക്കുന്നു
      } else {
        data.append(key, formData[key]);
      }
    });

    // ഫയലുകൾ ആഡ് ചെയ്യുന്നു
    if (files.image) data.append('image', files.image);
    if (files.certificates) data.append('certificates', files.certificates);
    if (files.idProof) data.append('idProof', files.idProof);

    try {
      // ശ്രദ്ധിക്കുക: Codespace ആണെങ്കിൽ URL മാറ്റണം
      const res = await axios.post('http://localhost:5000/api/v1/user/updateProfile', data);
      
      if (res.data.success) {
        alert("Profile Updated Successfully!");
        
        // ഇത് വളരെ പ്രധാനമാണ്: ബാക്കെൻഡിൽ നിന്നുള്ള പുതിയ ഡാറ്റ ലോക്കൽ സ്റ്റോറേജിൽ അപ്ഡേറ്റ് ചെയ്യുന്നു
        localStorage.setItem('user', JSON.stringify(res.data.data));
        
        // സ്റ്റേറ്റ് അപ്ഡേറ്റ് ചെയ്യുന്നു
        setUser(res.data.data);
        
        navigate('/expert-dashboard');
      }
    } catch (error) {
      console.log(error);
      alert("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.backBtn} onClick={() => navigate('/expert-dashboard')}>
          <FaArrowLeft /> Back to Dashboard
        </div>
        
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <div className={styles.header}>
            <h2>Update Professional Profile</h2>
            <p>Your information will be accurate and will help speed up admin verification.</p>
          </div>

          <div className={styles.mainGrid}>
            <div className={styles.uploadSection}>
              <div className={styles.profilePicWrapper}>
                <img src={previews.image || 'https://via.placeholder.com/150'} alt="Profile" />
                <label className={styles.cameraBtn}>
                  <FaCamera />
                  <input type="file" name="image" onChange={handleFileChange} hidden />
                </label>
              </div>

              <div className={styles.fileUploadBox}>
                <label>Identity Proof (ID Card)</label>
                <input type="file" name="idProof" onChange={handleFileChange} />
                {previews.idProof && <img src={previews.idProof} className={styles.previewSmall} alt="ID Preview" />}
              </div>

              <div className={styles.fileUploadBox}>
                <label>Professional Certificate</label>
                <input type="file" name="certificates" onChange={handleFileChange} />
                {previews.certificates && <img src={previews.certificates} className={styles.previewSmall} alt="Cert Preview" />}
              </div>
            </div>

            <div className={styles.detailsSection}>
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
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Profession</label>
                  <input list="professions" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Select or Type" />
                  <datalist id="professions">
                    <option value="Doctor" /><option value="Lawyer" /><option value="Engineer" /><option value="Teacher" />
                  </datalist>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Experience (Years)</label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Fee Per Hour (₹)</label>
                  <input type="number" name="fees" value={formData.fees} onChange={handleChange} required />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>About Me</label>
                <textarea name="about" value={formData.about} onChange={handleChange} rows="3"></textarea>
              </div>
            </div>
          </div>

          <div className={styles.availabilitySection}>
            <h3>Set Availability</h3>
            <div className={styles.daysGrid}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <button type="button" key={day} 
                  className={formData.availableDays.includes(day) ? styles.dayActive : styles.dayBtn}
                  onClick={() => handleDayChange(day)}
                >{day}</button>
              ))}
            </div>
            <div className={styles.row}>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
              <span>to</span>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ExpertProfile;