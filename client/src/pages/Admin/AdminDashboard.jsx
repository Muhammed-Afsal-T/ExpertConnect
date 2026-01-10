import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);

  // എക്സ്പെർട്ടുകളെ ഫെച്ച് ചെയ്യുന്നു
  const getAllExperts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/admin/getAllExperts', {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setExperts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async (expertId, status) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/admin/changeStatus', {
        expertId,
        status
      });
      if (res.data.success) {
        alert(`Expert ${status} successfully`);
        getAllExperts();
        setSelectedExpert(null); 
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    getAllExperts();
  }, []);

  return (
    <>
      <Navbar />
      
      <div className={styles.container}>
        <h2 className={styles.heading}>Admin Dashboard - Manage Experts</h2>
        
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Profession</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experts.length > 0 ? (
                experts.map((expert) => (
                  <tr key={expert._id}>
                    <td 
                        className={styles.clickableName} 
                        onClick={() => setSelectedExpert(expert)}
                    >
                        {expert.name} (View Details)
                    </td>
                    <td>{expert.email}</td>
                    <td>{expert.specialization || 'Not Added'}</td>
                    <td>{expert.experience ? expert.experience + ' Years' : '---'}</td>
                    
                    <td>
                      {!expert.isVerified ? (
                        <>
                            <button className={styles.approveBtn} onClick={() => handleStatus(expert._id, 'approved')}>Approve</button>
                            <button className={styles.rejectBtn} onClick={() => handleStatus(expert._id, 'rejected')}>Reject</button>
                        </>
                      ) : (
                        <span className={styles.verifiedBadge}>Already Verified</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center'}}>No Experts Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

{/* MODAL for Detailed View */}
{selectedExpert && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      <button className={styles.closeBtn} onClick={() => setSelectedExpert(null)}>X</button>
      <h3>Expert Details</h3>
      
      <div className={styles.modalGrid}>
        <img src={selectedExpert.image} alt="Profile" className={styles.profilePic} />
        <div className={styles.details}>
          <p><strong>Name:</strong> {selectedExpert.name}</p>
          <p><strong>Email:</strong> {selectedExpert.email}</p>
          {/* --- ഇതാ ഇവിടെയാണ് Age ആഡ് ചെയ്തിരിക്കുന്നത് --- */}
          <p><strong>Age:</strong> {selectedExpert.age} Years</p>
          <p><strong>Profession:</strong> {selectedExpert.specialization || 'N/A'}</p>
          <p><strong>Experience:</strong> {selectedExpert.experience} Years</p>
          <p><strong>Fees:</strong> ₹{selectedExpert.fees} / session</p>
        </div>
      </div>

      <div className={styles.infoSection}>
        <p><strong>About:</strong> {selectedExpert.about || 'No description provided'}</p>
        
        <div className={styles.availabilityBox}>
            <p><strong>Availability & Slots:</strong></p>
            {selectedExpert.availability && selectedExpert.availability.length > 0 ? (
                <div className={styles.availabilityList}>
                    {selectedExpert.availability.map((item, index) => (
                        <div key={index} className={styles.dateRow}>
                            <span className={styles.dateLabel}>{item.date}:</span>
                            <div className={styles.slotTags}>
                                {item.slots.map((s, si) => (
                                    <span key={si} className={styles.slotTag}>
                                        {s.startTime} - {s.endTime}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className={styles.noData}>No availability set yet.</p>
            )}
        </div>
      </div>

      <div className={styles.documentGrid}>
        <div>
          <p><strong>Identity Proof:</strong></p>
          <img src={selectedExpert.idProof} className={styles.docImage} alt="ID Proof" />
        </div>
        <div>
          <p><strong>Certificate:</strong></p>
          <img src={selectedExpert.certificates} className={styles.docImage} alt="Certificate" />
        </div>
      </div>

      <div className={styles.modalActions}>
        {!selectedExpert.isVerified && (
          <button className={styles.approveBtn} onClick={() => handleStatus(selectedExpert._id, 'approved')}>Approve Expert</button>
        )}
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default AdminDashboard;