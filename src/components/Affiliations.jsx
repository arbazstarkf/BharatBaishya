'use client';


import ScrollReveal from '@/components/ScrollReveal';
import styles from './Affiliations.module.css';

const affiliations = [
  { name: 'Assam Medical Council', logo: '/images/assam medical council.png' },
  { name: 'Sparsh Hospital, Rangia', logo: '/images/sparsh hospital logo.jpg' },
  { name: 'Association of Physicians of India', logo: '/images/Association of Physicians of India logo.png' },
  { name: 'Indian College of Physicians', logo: '/images/Indian College of Physicians.png' },
  { name: 'American Association of Clinical Endocrinologists', logo: '/images/american association of clinical endo.png' },
];

export default function Affiliations() {
  return (
    <section className={`section ${styles.affiliationsSection}`} id="affiliations">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <div className="section-badge">
              <i className="fa-solid fa-handshake"></i> Affiliations
            </div>
            <h2 className="section-title">Associated With</h2>
          </div>
        </ScrollReveal>
        <div className={styles.affiliationsGrid}>
          {affiliations.map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 80}>
              <div className={styles.affiliationCard}>
                <div className={styles.affiliationLogo}>
                  <img 
                    src={item.logo} 
                    alt={item.name} 
                    loading="lazy"
                    style={{ objectFit: 'contain', maxWidth: '100%', maxHeight: '60px' }}
                  />
                </div>
                <span>{item.name}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
