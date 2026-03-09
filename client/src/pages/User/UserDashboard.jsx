import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import styles from './UserDashboard.module.css';
import { FaFilter, FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    // Prompt users to complete profile fields required before booking.
    if (user && (!user.age || !user.gender || !user.specialization)) {
      setShowProfilePrompt(true);
    }
  }, []);

  useEffect(() => {
    // Reset pagination and refetch when any filter/search changes.
    setPage(1);
    fetchExperts(1);
  }, [searchQuery, selectedCategories, priceRange]);

  useEffect(() => {
    fetchExperts(page);
  }, [page]);

  useEffect(() => {
  if (page > 1) {
    fetchExperts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); //
  }
  }, [page]);

  const fetchExperts = async (currentPage = 1) => {
    try {
      setLoading(true);
      // Server-side search/filter/pagination query.
      const categoryParam = selectedCategories.join(',');
      const res = await axios.get(`https://expertconnect-backend-3hhu.onrender.com/api/v1/user/getAllExperts`, {
        params: {
          page: currentPage,
          limit: 21,
          search: searchQuery,
          category: categoryParam,
          priceRange: priceRange
        }
      });
      if (res.data.success) {
        setExperts(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filter pass for immediate UI refinement.
  useEffect(() => {
    let result = experts;

    // 1) Search by name/specialization.
    if (searchQuery) {
      result = result.filter(expert =>
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2) Category grouping with explicit "others" bucket.
    if (selectedCategories.length > 0) {
      result = result.filter(expert => {
        const prof = expert.specialization?.toLowerCase();
        
        const mainCategories = ['doctor', 'lawyer', 'engineer'];
        const isOthersSelected = selectedCategories.includes('others');
        
        if (selectedCategories.includes(prof)) return true;
        if (isOthersSelected && !mainCategories.includes(prof)) return true;
        
        return false;
      });
    }

    // 3) Price bracket filter.
    if (priceRange) {
      result = result.filter(expert => {
        const fees = expert.fees;
        if (priceRange === "0-1000") return fees <= 1000;
        if (priceRange === "1000-5000") return fees > 1000 && fees <= 5000;
        if (priceRange === "5000+") return fees > 5000;
        return true;
      });
    }

    setFilteredExperts(result);
  }, [searchQuery, selectedCategories, priceRange, experts]);

  // Toggle category chips in multiselect state.
  const handleCategoryChange = (category) => {
    const lowerCat = category.toLowerCase();
    setSelectedCategories(prev => 
      prev.includes(lowerCat) 
        ? prev.filter(c => c !== lowerCat) 
        : [...prev, lowerCat]
    );
  };

  return (
    <>
      <Navbar onSearch={setSearchQuery} />
      
      <div className={styles.container}>
        <button className={styles.filterToggle} onClick={() => setShowFilter(!showFilter)}>
          <FaFilter /> <span>Filters</span>
        </button>

        <div className={styles.mainLayout}>
          {/* Sidebar */}
          <div className={`${styles.filterSidebar} ${showFilter ? styles.show : ''}`}>
            <h3>Categories</h3>
            <div className={styles.filterGroup}>
              {['Doctor', 'Lawyer', 'Engineer', 'Others'].map(cat => (
                <label key={cat}>
                  <input 
                    type="checkbox" 
                    onChange={() => handleCategoryChange(cat)}
                    checked={selectedCategories.includes(cat.toLowerCase())}
                  /> {cat}
                </label>
              ))}
            </div>

            <h3>Price Range</h3>
            <div className={styles.filterGroup}>
              <label>
                <input type="radio" name="price" value="" onChange={() => setPriceRange("")} checked={priceRange === ""} /> All Prices
              </label>
              <label>
                <input type="radio" name="price" value="0-1000" onChange={(e) => setPriceRange(e.target.value)} checked={priceRange === "0-1000"} /> ₹0 - ₹1000
              </label>
              <label>
                <input type="radio" name="price" value="1000-5000" onChange={(e) => setPriceRange(e.target.value)} checked={priceRange === "1000-5000"} /> ₹1000 - ₹5000
              </label>
              <label>
                <input type="radio" name="price" value="5000+" onChange={(e) => setPriceRange(e.target.value)} checked={priceRange === "5000+"} /> Above ₹5000
              </label>
            </div>
            
            <button className={styles.clearBtn} onClick={() => { setSelectedCategories([]); setPriceRange(""); }}>Clear All</button>
            <button className={styles.closeFilter} onClick={() => setShowFilter(false)}>Close</button>
          </div>

          {/* Expert Grid */}
          <div className={styles.expertGrid}>
            {filteredExperts.length > 0 ? (
              filteredExperts.map((expert) => (
                <div key={expert._id} className={styles.expertCard}>
                  <img src={expert.image} alt={expert.name} className={styles.expertImg} />
                  <div className={styles.cardInfo}>
                    <h4>{expert.name}</h4>
                    <p className={styles.specialization}>{expert.specialization || "Expert"}</p>
                    
                    <div className={styles.rating}>
                      {expert.numReviews > 0 ? (
                        <>
                          <FaStar className={styles.starIcon} />
                          <span>{expert.averageRating.toFixed(1)} ({expert.numReviews} reviews)</span>
                        </>
                      ) : (
                        <span className={styles.noRating}><FaRegStar /> No Ratings</span>
                      )}
                    </div>

                    <p className={styles.fees}>₹{expert.fees} </p>
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
              <div className={styles.noDataSection}>
                 <p className={styles.noData}>No experts found matching your criteria.</p>
              </div>
            )}
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>Prev</button>
                <span className={styles.pageInfo}>Page <strong>{page}</strong> of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Profile Completion Modal */}
      {showProfilePrompt && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Complete Your Profile</h3>
            <p>Please provide your Age, Gender, and Profession before booking a consultation.</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.completeBtn} 
                onClick={() => navigate('/profile')}
              >
                Go to Profile
              </button>
              <button 
                className={styles.maybeLater} 
                onClick={() => setShowProfilePrompt(false)}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
