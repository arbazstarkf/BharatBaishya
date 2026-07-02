'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CookieBanner.module.css';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = cookieState();

  function cookieState() {
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
      const consent = localStorage.getItem('cookieConsent');
      if (!consent) {
        // Show after a small delay for better UX
        const timer = setTimeout(() => {
          setVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, []);

    return [visible, setVisible];
  }

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.bannerOverlay}>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerContent}>
          <div className={styles.iconContainer}>
            <i className="fa-solid fa-cookie-bite"></i>
          </div>
          <div className={styles.textContent}>
            <p>
              <strong>We value your privacy.</strong> We use cookies to analyze website traffic and optimize your website experience. 
              By accepting our use of cookies, your data will be aggregated with all other user data. 
              Learn more in our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleDecline} className={styles.declineButton}>
            Decline
          </button>
          <button onClick={handleAccept} className={styles.acceptButton}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
