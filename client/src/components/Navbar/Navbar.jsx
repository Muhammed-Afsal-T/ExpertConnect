import React, { useState, useEffect, useRef } from 'react';
import { useNavigate ,useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaUserCircle, FaSignOutAlt, FaSearch, FaCommentDots } from 'react-icons/fa';

const Navbar = ({ onSearch }) => { 
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const dropdownRef = useRef(null); 
  const searchInputRef = useRef(null);
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (role === 'admin') navigate('/admin');
    else if (role === 'expert') navigate('/expert-dashboard');
    else if (role === 'user') navigate('/user-dashboard');
    else navigate('/login');
  };

  const handleProfileClick = () => {
    if (role === 'expert') navigate('/expert/profile'); 
    else if (role === 'admin') navigate('/admin');
    else navigate('/profile'); 
    setShowDropdown(false);
  };

  const handleChatClick = () => {
    if (role === 'expert') navigate('/expert/chat');
    else navigate('/chat');
  };

  const handleSearchToggle = () => {
    setIsSearchActive(true);
    // Focus on input after state update
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSearchBlur = () => {
    // Small delay to allow click events on suggestions
    setTimeout(() => {
      setIsSearchActive(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isSearchActive ? styles.searchActive : ''}`}>
      <div className={styles.logo} onClick={handleLogoClick}>
        ExpertConnect
      </div>

      {/* Mobile Search Toggle Button */}
      {role === 'user' && location.pathname === '/user-dashboard' && !isSearchActive && (
        <button className={styles.mobileSearchToggle} onClick={handleSearchToggle}>
          <span>search</span> <FaSearch size={20} />
        </button>
      )}

      {role === 'user' && location.pathname === '/user-dashboard' && (
        <div className={styles.searchBar}>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Search for experts..." 
            onChange={(e) => onSearch && onSearch(e.target.value)}
            onBlur={handleSearchBlur}
          />
          <FaSearch className={styles.searchIcon} />
        </div>
      )}

      <div className={styles.navLinks}>
        {role !== 'admin' && (
          <div className={styles.iconItem} title="Chat">
            <FaCommentDots size={22} onClick={handleChatClick} style={{cursor: 'pointer'}}/>
          </div>
        )}
        
        <div className={styles.profileSection} ref={dropdownRef} onClick={() => setShowDropdown(!showDropdown)}>
          <FaUserCircle size={28} className={styles.profileIcon} />
          
          {showDropdown && (
            <div className={styles.dropdown}>
              {role === 'admin' ? (
                <>
                  <span onClick={() => { navigate('/admin-reports'); setShowDropdown(false); }}>Reports</span>
                  <span onClick={handleLogout} className={styles.logoutText}>Logout</span>
                </>
              ) : (
                <>
                  <span onClick={handleProfileClick}>Profile</span>
                  <span onClick={handleLogout} className={styles.logoutText}>Logout</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;