import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import Navbar from '../../components/Navbar/Navbar'; 
import styles from './ExpertProfile.module.css'; 
import { FaArrowLeft, FaCamera, FaPlus, FaTrash, FaRegCalendarAlt, FaClock, FaTimes } from 'react-icons/fa'; 

const ExpertProfile = () => { 
  const navigate = useNavigate(); 
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); 
  const [loading, setLoading] = useState(false); 

  // Gets today's date in IST (to filter out past dates)
  const todayIST = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  const [formData, setFormData] = useState({ 
    userId: user?._id, 
    name: user?.name, 
    email: user?.email, 
    age: user?.age || '', 
    specialization: user?.specialization || '', 
    experience: user?.experience || '', 
    fees: user?.fees || '', 
    about: user?.about || '', 
  }); 

  // Filtering out past dates while loading
  const [availability, setAvailability] = useState(
    (user?.availability || []).filter(a => a.date >= todayIST)
  ); 
  
  const [tempDate, setTempDate] = useState(""); 

  const [files, setFiles] = useState({ image: null, certificates: null, idProof: null }); 
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

  // --- Slot Logic Functions --- 
  const addDate = (e) => { 
    e.preventDefault(); 
    if (!tempDate) return alert("Please select a date"); 
     
    if (availability.find(a => a.date === tempDate)) return alert("This date is already added"); 
     
    setAvailability([...availability, { date: tempDate, slots: [{ startTime: "", endTime: "" }] }]); 
    setTempDate(""); 
  }; 

  const removeDate = (e, index) => { 
    e.preventDefault(); 
    const updated = availability.filter((_, i) => i !== index); 
    setAvailability(updated); 
  }; 

  const addSlot = (e, dateIndex) => { 
    e.preventDefault(); 
    if (availability[dateIndex].slots.length >= 3) return alert("Maximum 3 slots per day"); 
    const updated = [...availability]; 
    updated[dateIndex].slots.push({ startTime: "", endTime: "" }); 
    setAvailability(updated); 
  }; 

  const updateSlot = (dateIndex, slotIndex, field, value) => { 
    const updated = [...availability]; 
    updated[dateIndex].slots[slotIndex][field] = value; 
    setAvailability(updated); 
  }; 

  const removeSlot = (e, dateIndex, slotIndex) => { 
    e.preventDefault(); 
    const updated = [...availability]; 
    updated[dateIndex].slots = updated[dateIndex].slots.filter((_, i) => i !== slotIndex); 
    setAvailability(updated); 
  }; 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setLoading(true); 
    const data = new FormData(); 

    Object.keys(formData).forEach(key => data.append(key, formData[key])); 
     
    // Filtering once more before sending
    const cleanAvailability = availability.filter(a => a.date >= todayIST);
    data.append('availability', JSON.stringify(cleanAvailability)); 

    if (files.image) data.append('image', files.image); 
    if (files.certificates) data.append('certificates', files.certificates); 
    if (files.idProof) data.append('idProof', files.idProof); 

    try { 
      const res = await axios.post('http://localhost:5000/api/v1/user/updateProfile', data); 
      if (res.data.success) { 
        alert("Profile Updated Successfully!"); 
         
        localStorage.setItem('user', JSON.stringify(res.data.data)); 
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
            <h2>Update Your Profile</h2> 
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
                  <input type="number" name="age" value={formData.age} onChange={handleChange} min="13" max="100" required /> 
                </div> 
                <div className={styles.inputGroup}> 
                  <label>Profession</label> 
                  <input list="professions" name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Select Profession" /> 
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
                  <label>Fee (₹)</label> 
                  <input type="number" name="fees" value={formData.fees} onChange={handleChange} required /> 
                </div> 
              </div> 
              <div className={styles.inputGroup}> 
                <label>About Me</label> 
                <textarea name="about" value={formData.about} onChange={handleChange} rows="3" placeholder="Tell users about your expertise"></textarea> 
              </div> 
            </div> 
          </div> 

          <div className={styles.availabilitySection}> 
            <h3><FaRegCalendarAlt /> Manage Availability Slots</h3> 
            <div className={styles.datePickerRow}> 
              <input  
                type="date"  
                value={tempDate}  
                onChange={(e) => setTempDate(e.target.value)}  
                min={todayIST}  
              /> 
              <button type="button" onClick={addDate} className={styles.addDateBtn}> 
                <FaPlus /> Add Date 
              </button> 
            </div> 

            <div className={styles.availabilityGrid}> 
              {availability.map((item, dIndex) => ( 
                <div key={dIndex} className={styles.dateCard}> 
                  <div className={styles.dateHeader}> 
                    <h4>{item.date}</h4> 
                    <FaTrash className={styles.deleteIcon} onClick={(e) => removeDate(e, dIndex)} /> 
                  </div> 
                  {item.slots.map((slot, sIndex) => ( 
                    <div key={sIndex} className={styles.slotRow}> 
                      <input  
                        type="time"  
                        value={slot.startTime}  
                        onChange={(e) => updateSlot(dIndex, sIndex, 'startTime', e.target.value)}  
                        required  
                      /> 
                      <span>to</span> 
                      <input  
                        type="time"  
                        value={slot.endTime}  
                        onChange={(e) => updateSlot(dIndex, sIndex, 'endTime', e.target.value)}  
                        required  
                      /> 
                      {item.slots.length > 1 && ( 
                        <FaTimes className={styles.removeSlot} onClick={(e) => removeSlot(e, dIndex, sIndex)} /> 
                      )} 
                    </div> 
                  ))} 
                  {item.slots.length < 3 && ( 
                    <button type="button" className={styles.addSlotBtn} onClick={(e) => addSlot(e, dIndex)}> 
                      <FaPlus /> Add Slot 
                    </button> 
                  )} 
                </div> 
              ))} 
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