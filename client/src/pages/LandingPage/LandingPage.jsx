import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float, Sphere } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { FaUserMd, FaChalkboardTeacher, FaComments, FaVideo, FaShieldAlt, FaFilter, FaStar } from 'react-icons/fa';

const InteractiveShape = () => {
  const [hovered, setHover] = useState(false);

 useEffect(() => {
    const customCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="%230056b3" fill-opacity="0.2" stroke="%230056b3" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="%230056b3"/></svg>') 16 16, auto`;
    document.body.style.cursor = hovered ? customCursor : 'auto';
  }, [hovered]);
  
  return (
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
      <Sphere 
        args={[1, 32, 32]} 
        scale={2.2}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <meshStandardMaterial
          color={hovered ? "#ffffff" : "#d7eef7"}
          wireframe={true}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <FaChalkboardTeacher />, title: "Expert Mentorship", desc: "One-on-one sessions with industry leaders." },
    { icon: <FaVideo />, title: "Video Calls", desc: "Secure in-platform video consultations." },
    { icon: <FaComments />, title: "Instant Chat", desc: "Clear your doubts in real-time." },
    { icon: <FaUserMd />, title: "Verified Professionals", desc: "Thoroughly verified experts for quality." },
    { icon: <FaShieldAlt />, title: "Secure Payments", desc: "Safe and hassle-free transactions." },
    { icon: <FaFilter />, title: "Advanced Search", desc: "Find the perfect expert using smart filters." },
    { icon: <FaStar />, title: "Ratings & Feedback", desc: "Trusted reviews after every session." }
  ];

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>ExpertConnect</div>
        <div className={styles.navLinks}>
          <button onClick={() => navigate('/login')} className={styles.loginBtn}>Login</button>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.canvasContainer}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <ambientLight intensity={1} />
              <pointLight position={[10, 10, 10]} />
              <InteractiveShape />
              <OrbitControls enableZoom={false} autoRotate />
            </Suspense>
          </Canvas>
        </div>

        <div className={styles.heroContent}>
          <h1>Your Direct Link to <span>Global Experts</span></h1>
          <p>Get professional mentorship and consultation in real-time. Connect with top industry experts for personalized guidance.</p>
          <div className={styles.heroActions}>
            <button onClick={() => navigate('/register')} className={styles.mainBtn}>Get Started</button>
            <button onClick={() => navigate('/login')} className={styles.outlineBtn}>Explore Experts</button>
          </div>
        </div>
      </header>

      <section className={styles.features}>
        <h2>Our Key Features</h2>
        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.icon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2026 ExpertConnect. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;