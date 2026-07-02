import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Disclaimer | Dr. Bharat Baishya',
  description: 'Disclaimer',
};

export default function DisclaimerPage() {
  return (
    <div className="container section">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.icon}>
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
          <h1>Disclaimer</h1>
        </header>

        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <p className={styles.introText}>
                The information provided on this website is for general informational and educational purposes only. Please read this disclaimer carefully before using our website.
              </p>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>1</div>
                  <h2>Not Medical Advice</h2>
                </div>
                <p>
                  The content on this website, including but not limited to text, graphics, images, and other materials, is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.
                </p>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>2</div>
                  <h2>Medical Emergencies</h2>
                </div>
                <p>
                  If you think you may have a medical emergency, call your doctor, go to the nearest hospital emergency department, or call emergency services immediately. This website and its communication channels (including WhatsApp) should not be used for medical emergencies.
                </p>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>3</div>
                  <h2>No Doctor-Patient Relationship</h2>
                </div>
                <p>
                  Use of this website, including sending inquiries or reading blog posts, does not establish a doctor-patient relationship. A doctor-patient relationship is only established after an in-person consultation.
                </p>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>4</div>
                  <h2>Accuracy of Information</h2>
                </div>
                <p>
                  While we strive to keep the information on this website accurate and up-to-date, medical knowledge constantly evolves. Therefore, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information provided.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.contactNote}>
            <div className={styles.contactIcon}>
              <i className="fa-solid fa-calendar-check"></i>
            </div>
            <div className={styles.contactContent}>
              <h3>Ready to see the doctor?</h3>
              <p>
                To receive professional medical advice, diagnosis, and treatment tailored to your specific health needs,<Link href="/appointment">book an appointment</Link> for a consultation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
