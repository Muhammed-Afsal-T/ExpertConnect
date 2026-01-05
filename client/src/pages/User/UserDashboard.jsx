import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './UserDashboard.module.css';
import { FaFilter, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]); // എക്സ്പെർട്ടുകളുടെ ലിസ്റ്റ്
  const [showFilter, setShowFilter] = useState(false); // ഫിൽട്ടർ ടോഗിൾ
  const [searchQuery, setSearchQuery] = useState(""); // സെർച്ച് ലോജിക്

  // ബാക്കെൻഡിൽ നിന്ന് വെരിഫൈഡ് ആയ എക്സ്പെർട്ടുകളെ മാത്രം എടുക്കുന്നു
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/v1/user/getAllExperts');
        if (res.data.success) {
          setExperts(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchExperts();
  }, []);

  return (
    <>
      <Navbar onSearch={setSearchQuery} /> {/* സെർച്ച് ബാർ നാവിഗേഷനിൽ */}
      
      <div className={styles.container}>
        {/* Filter Toggle Button */}
        <button className={styles.filterToggle} onClick={() => setShowFilter(!showFilter)}>
          <FaFilter /> Filters
        </button>

        <div className={styles.mainLayout}>
          {/* Slide-in Filter Sidebar */}
          <div className={`${styles.filterSidebar} ${showFilter ? styles.show : ''}`}>
            <h3>Categories</h3>
            <div className={styles.filterGroup}>
              <label><input type="checkbox" /> Doctor</label>
              <label><input type="checkbox" /> Lawyer</label>
              <label><input type="checkbox" /> Engineer</label>
              <label><input type="checkbox" /> Others</label>
            </div>

            <h3>Price Range</h3>
            <div className={styles.filterGroup}>
              <label><input type="radio" name="price" /> ₹0 - ₹1000</label>
              <label><input type="radio" name="price" /> ₹1000 - ₹5000</label>
              <label><input type="radio" name="price" /> Above ₹5000</label>
            </div>
            <button className={styles.closeFilter} onClick={() => setShowFilter(false)}>Close</button>
          </div>

          {/* Expert Cards Grid */}
          <div className={styles.expertGrid}>
            {experts.length > 0 ? (
              experts.map((expert) => (
                <div key={expert._id} className={styles.expertCard}>
                  <img src={expert.image} alt={expert.name} className={styles.expertImg} />
                  <div className={styles.cardInfo}>
                    <h4>{expert.name}</h4>
                    <p className={styles.specialization}>{expert.specialization}</p>
                    <div className={styles.rating}>
                      <FaStar className={styles.starIcon} /> 4.5 <span>(10 reviews)</span>
                    </div>
                    <p className={styles.fees}>₹{expert.fees} /hr</p>
                    <button 
                      className={styles.bookBtn}
                      onClick={() => navigate(`/book-expert/${expert._id}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noData}>No experts found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;