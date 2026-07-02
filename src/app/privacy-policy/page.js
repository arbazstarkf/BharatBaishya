import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Privacy Policy | Dr. Bharat Baishya',
  description: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container section">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div className={styles.icon}>
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h1>Privacy Policy</h1>

        </header>

        <div className={styles.content}>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <p className={styles.introText}>
                We are committed to protecting your privacy and ensuring the security of your personal and medical information. This Privacy Policy outlines how we collect, use, and protect your data.
              </p>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>1</div>
                  <h2>Data We Collect</h2>
                </div>
                <p>We may collect the following types of personal data when you use our website or services:</p>
                <ul>
                  <li><strong>Personal Information:</strong> Full name, phone number, email address (optional), age, gender, and address.</li>
                  <li><strong>Health Information:</strong> Reason for visit(optional)</li>
                </ul>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>2</div>
                  <h2>Purpose of Data Collection</h2>
                </div>
                <p>We strictly collect and process your data for the following specified, clear, and lawful purposes:</p>
                <ul>
                  <li>To schedule and manage your medical appointments.</li>
                  <li>To provide medical consultations, diagnosis, and treatment.</li>
                  <li>To maintain accurate patient records (visits, appointments).</li>
                  <li>To communicate with you regarding appointment confirmations and follow-ups.</li>
                </ul>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>3</div>
                  <h2>Consent</h2>
                </div>
                <p>
                  By booking an appointment or providing your personal details, you give us explicit consent to collect and process your data as outlined in this policy. You have the right to withdraw your consent at any time; however, please note that withdrawing consent may affect our ability to provide medical care or maintain accurate medical records.
                </p>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>4</div>
                  <h2>Data Storage and Security</h2>
                </div>
                <p>
                  We implement reasonable security practices and procedures to protect your data from unauthorized access, loss, or disclosure. Your data are stored securely. Access to this data is strictly limited to authorized medical and administrative personnel.
                </p>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>5</div>
                  <h2>Data Sharing</h2>
                </div>
                <p>
                  We do not sell or share your personal data with third parties for marketing purposes. Your data may only be shared:
                </p>
                <ul>
                  <li>With your explicit consent.</li>
                  <li>When required by law or to comply with a legal obligation.</li>
                </ul>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>6</div>
                  <h2>Your Rights </h2>
                </div>
                <ul>
                  <li><strong>Right to Access:</strong> You can request a summary of the personal data we hold about you.</li>
                  <li><strong>Right to Correction:</strong> You can request the correction of inaccurate or incomplete personal data.</li>
                  <li><strong>Right to Erasure:</strong> You can request the deletion of your data when it is no longer needed for the purpose it was collected (subject to legal requirements to retain medical records).</li>
                  <li><strong>Right of Grievance Redressal:</strong> You have the right to readily available means of registering a grievance with us.</li>
                </ul>
              </div>

              <div className={styles.policySection}>
                <div className={styles.sectionHeader}>
                  <div className={styles.pointNumber}>7</div>
                  <h2>Cookies and Tracking</h2>
                </div>
                <p>
                  Our website uses cookies and similar tracking technologies (such as Google Analytics) to enhance your browsing experience, analyze site traffic, and understand where our audience comes from.
                </p>
                <ul>
                  <li><strong>What are cookies:</strong> Cookies are small text files stored on your device that help the website remember your actions and preferences.</li>
                  <li><strong>Analytics Data:</strong> We collect anonymized data such as your IP address, browser type, device information, and the pages you visit on our site. This information is strictly used for analytical purposes to improve our website and services, and is not linked to your personal medical records.</li>
                  <li><strong>Your Choices:</strong> You can choose to accept or decline cookies through our cookie consent banner or your browser settings. Declining cookies will not prevent you from using our website to book appointments.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.contactNote}>
            <div className={styles.contactContent}>
              
              <p>
                If you wish to exercise any of your rights (such as data deletion or correction) or have any concerns about this Privacy Policy, please submit an inquiry through our <Link href="/contact" id="privacy-policy-contact-link">Contact Page</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
