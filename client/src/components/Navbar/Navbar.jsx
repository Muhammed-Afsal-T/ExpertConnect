import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { FaUserCircle, FaSignOutAlt, FaSearch, FaCommentDots } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'expert') {
      navigate('/expert-dashboard');
    } else if (role === 'user') {
      navigate('/user-dashboard'); 
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo} onClick={handleLogoClick}>
        ExpertConnect
      </div>

      {role === 'user' && (
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search for experts..." />
          <FaSearch className={styles.searchIcon} />
        </div>
      )}

      <div className={styles.navLinks}>
        {role === 'admin' ? (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout <FaSignOutAlt />
          </button>
        ) : (
          <>
            <div className={styles.iconItem} title="Chat">
              <FaCommentDots size={22} />
            </div>
            <div className={styles.profileSection}>
              <FaUserCircle size={28} className={styles.profileIcon} />
              <div className={styles.dropdown}>
                <span onClick={() => navigate('/profile')}>Profile</span>
                <span onClick={handleLogout} className={styles.logoutText}>Logout</span>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;