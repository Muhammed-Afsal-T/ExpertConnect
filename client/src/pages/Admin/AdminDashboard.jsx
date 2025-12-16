import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null); // മോഡൽ കാണിക്കാൻ

  // Get Experts
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

  // Approve/Reject Logic
  const handleStatus = async (expertId, status) => {
    try {
      const res = await axios.post('http://localhost:5000/api/v1/admin/changeStatus', {
        expertId,
        status
      });
      if (res.data.success) {
        alert(`Expert ${status} successfully`);
        getAllExperts();
        setSelectedExpert(null); // മോഡൽ ക്ലോസ് ചെയ്യുന്നു
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
                    {/* പേരിൽ ക്ലിക്ക് ചെയ്താൽ ഡീറ്റെയിൽസ് കാണിക്കും */}
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
                  <td colSpan="5" style={{textAlign: 'center'}}>No Experts Found (Check API URL)</td>
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
                        <p><strong>Profession:</strong> {selectedExpert.specialization || 'N/A'}</p>
                        <p><strong>Experience:</strong> {selectedExpert.experience || 0} Years</p>
                        <p><strong>Age:</strong> {selectedExpert.age || 'N/A'}</p>
                        <p><strong>Fees:</strong> ₹{selectedExpert.fees || 0} /hr</p>
                    </div>
                </div>

                <div className={styles.proofSection}>
                    <p><strong>ID Proof / Certificate:</strong></p>
                    {selectedExpert.certificates ? (
                        <img src={selectedExpert.certificates} alt="Certificate" className={styles.certImage} />
                    ) : (
                        <p className={styles.noCert}>No document uploaded</p>
                    )}
                </div>

                <div className={styles.modalActions}>
                    {!selectedExpert.isVerified && (
                        <>
                            <button className={styles.approveBtn} onClick={() => handleStatus(selectedExpert._id, 'approved')}>Approve</button>
                            <button className={styles.rejectBtn} onClick={() => handleStatus(selectedExpert._id, 'rejected')}>Reject</button>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;