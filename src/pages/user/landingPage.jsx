import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

function LandingPage() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#1a1a2e',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      margin: 0,
      padding: 0,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    heroSection: {
      transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
      opacity: isLoaded ? 1 : 0,
      transition: 'all 1s ease-out',
      marginBottom: '3rem'
    },
    mainTitle: {
      fontSize: 'clamp(3rem, 8vw, 8rem)',
      fontWeight: 'bold',
      margin: '0 0 1rem 0',
      color: '#ffffff'
    },
    subtitle: {
      fontSize: 'clamp(2rem, 6vw, 4rem)',
      fontWeight: 'bold',
      margin: '0 0 2rem 0',
      color: '#ffffff'
    },
    description: {
      transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
      opacity: isLoaded ? 1 : 0,
      transition: 'all 1s ease-out 0.3s',
      marginBottom: '3rem'
    },
    mainDescription: {
      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
      color: '#cccccc',
      marginBottom: '1rem',
      maxWidth: '800px',
      lineHeight: 1.6
    },
    subDescription: {
      fontSize: 'clamp(1rem, 2vw, 1.125rem)',
      color: '#999999',
      marginBottom: '0',
      maxWidth: '600px'
    },
    ctaSection: {
      transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
      opacity: isLoaded ? 1 : 0,
      transition: 'all 1s ease-out 0.5s',
      marginBottom: '4rem'
    },
    ctaButton: {
      padding: '16px 48px',
      fontSize: '1.25rem',
      fontWeight: '600',
      color: 'white',
      border: 'none',
      borderRadius: '50px',
      cursor: 'pointer',
      background: '#6366f1',
      transition: 'all 0.3s ease',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
    },
    featuresGrid: {
      transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
      opacity: isLoaded ? 1 : 0,
      transition: 'all 1s ease-out 0.7s',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      maxWidth: '1200px',
      width: '100%',
      padding: '0 20px'
    },
    featureCard: {
      padding: '2rem',
      borderRadius: '16px',
      background: '#2d2d44',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: 'white',
      marginBottom: '0.5rem'
    },
    featureDescription: {
      color: '#cccccc',
      fontSize: '0.875rem',
      lineHeight: 1.5
    }
  };

  const [hoveredButton, setHoveredButton] = useState(false);
  const [hoveredCards, setHoveredCards] = useState({});

  const features = [
    { title: "Lightning Fast", desc: "Instant messaging with zero lag and real-time updates" },
    { title: "Secure & Private", desc: "End-to-end encrypted conversations for complete privacy" },
    { title: "Beautiful Design", desc: "Stunning interface that adapts to your preferences" }
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          background: #1a1a2e;
        }
      `}</style>

      <div style={styles.container}>
        {/* Hero section */}
        <div style={styles.heroSection}>
          <h1 style={styles.mainTitle}>Let's Chat</h1>
          <h2 style={styles.subtitle}>Together</h2>
        </div>

        {/* Description */}
        <div style={styles.description}>
          <p style={styles.mainDescription}>
            Connect, communicate, and collaborate in real-time
          </p>
          <p style={styles.subDescription}>
            Experience seamless conversations with cutting-edge technology and beautiful design
          </p>
        </div>

        {/* CTA Button */}
        <div style={styles.ctaSection}>
          <button
            style={{
              ...styles.ctaButton,
              transform: hoveredButton ? 'scale(1.05)' : 'scale(1)',
              boxShadow: hoveredButton ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 10px 25px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={() => setHoveredButton(true)}
            onMouseLeave={() => setHoveredButton(false)}
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>

        {/* Features */}
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                ...styles.featureCard,
                transform: hoveredCards[index] ? 'scale(1.05)' : 'scale(1)',
                background: hoveredCards[index] ? '#3d3d5c' : '#2d2d44'
              }}
              onMouseEnter={() => setHoveredCards(prev => ({ ...prev, [index]: true }))}
              onMouseLeave={() => setHoveredCards(prev => ({ ...prev, [index]: false }))}
            >
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LandingPage;