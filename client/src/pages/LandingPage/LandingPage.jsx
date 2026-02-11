import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { 
  FaUserMd, 
  FaChalkboardTeacher, 
  FaComments, 
  FaVideo, 
  FaShieldAlt, 
  FaFilter, 
  FaStar 
} from 'react-icons/fa';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* --- Navbar --- */}
      <nav className={styles.navbar}>
        <div className={styles.logo}>ExpertConnect</div>
        <div className={styles.navLinks}>
          <button onClick={() => navigate('/login')} className={styles.loginBtn}>Login</button>
          <button onClick={() => navigate('/register')} className={styles.joinBtn}>Join Now</button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Your Direct Link to <span>Global Experts.</span></h1>
          <p>Get professional mentorship and consultation in real-time. Connect with top industry experts for personalized guidance.</p>
          <div className={styles.heroActions}>
            <button onClick={() => navigate('/register')} className={styles.mainBtn}>Get Started</button>
            <button onClick={() => navigate('/login')} className={styles.outlineBtn}>Explore Experts</button>
          </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section className={styles.features}>
        <h2>Our Key Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <FaChalkboardTeacher className={styles.icon} />
            <h3>Expert Mentorship</h3>
            <p>One-on-one sessions with industry leaders to guide your career path.</p>
          </div>
          <div className={styles.featureCard}>
            <FaVideo className={styles.icon} />
            <h3>Video Consultations</h3>
            <p>Secure in-platform video calls for clear and effective communication.</p>
          </div>
          <div className={styles.featureCard}>
            <FaComments className={styles.icon} />
            <h3>Real-time Chat</h3>
            <p>Directly chat with experts to clear your doubts instantly.</p>
          </div>
          <div className={styles.featureCard}>
            <FaUserMd className={styles.icon} />
            <h3>Verified Professionals</h3>
            <p>Every expert on our platform is thoroughly verified for quality.</p>
          </div>
          
          {/* --- New Features Added --- */}
          <div className={styles.featureCard}>
            <FaShieldAlt className={styles.icon} />
            <h3>Secure Payments</h3>
            <p>Safe and hassle-free transactions through integrated payment gateways.</p>
          </div>
          <div className={styles.featureCard}>
            <FaFilter className={styles.icon} />
            <h3>Advanced Search</h3>
            <p>Find the perfect expert easily using our smart filters and categories.</p>
          </div>
          <div className={styles.featureCard}>
            <FaStar className={styles.icon} />
            <h3>Ratings & Feedback</h3>
            <p>Read trusted reviews and rate your experience after every session.</p>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className={styles.footer}>
        <p>&copy; 2026 ExpertConnect. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;