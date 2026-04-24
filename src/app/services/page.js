import Link from 'next/link';
import ParallaxSection from '@/components/ParallaxSection';
import ServiceCard from '@/components/ServiceCard';
import ScrollRevealClient from '../about/ScrollRevealClient';
import styles from './services.module.css';

export const metadata = {
  title: 'Services & Specialties | Dr. Bharat Baishya',
  description: 'Comprehensive healthcare services including Internal Medicine, Diabetes Management, Chronic Disease Care, Preventive Checkups, and Lifestyle Counseling.',
  alternates: { canonical: 'https://drbharatassam.com/services' },
};

const services = [
  { 
    id: 'internal-medicine',
    icon: 'fa-stethoscope', 
    title: 'Internal Medicine', 
    description: 'Comprehensive diagnosis and treatment of adult diseases. As a consultant physician, Dr. Baishya approaches adult healthcare comprehensively, dealing with the prevention, diagnosis, and treatment of both common and complex adult diseases.',
    features: ['Fever & Infections', 'Respiratory Issues', 'Gastrointestinal Problems', 'General Weakness'] 
  },
  { 
    id: 'diabetes',
    icon: 'fa-droplet', 
    title: 'Diabetes Management', 
    description: 'Specialized, evidence-based diabetes care (CCEBDM certified). Focuses on optimal blood sugar control through personalized treatment plans, lifestyle modifications, and continuous monitoring to prevent long-term complications.',
    features: ['Type 1 & 2 Diabetes', 'Gestational Diabetes', 'Insulin Therapy', 'Dietary Counseling']
  },
  { 
    id: 'chronic-disease',
    icon: 'fa-heart-pulse', 
    title: 'Chronic Disease Care', 
    description: 'Expert management of long-term health conditions. We provide ongoing care, regular monitoring, and medication management to help patients maintain a good quality of life despite chronic illnesses.',
    features: ['Hypertension', 'Thyroid Disorders', 'Asthma & COPD', 'Arthritis']
  },
  { 
    id: 'preventive',
    icon: 'fa-shield-heart', 
    title: 'Preventive Health Checkups', 
    description: 'Comprehensive screening programs designed to detect potential health issues before they become serious. Regular checkups are crucial for early diagnosis and optimal long-term health.',
    features: ['Annual Health Screening', 'Cardiac Risk Assessment', 'Diabetes Screening', 'Geriatric Care']
  },
  { 
    id: 'lifestyle',
    icon: 'fa-apple-whole', 
    title: 'Lifestyle Counseling', 
    description: 'Holistic approach to health through lifestyle modifications. Expert guidance on nutrition, physical activity, and stress management to prevent and manage lifestyle-related medical conditions.',
    features: ['Weight Management', 'Dietary Planning', 'Stress Management', 'Smoking Cessation']
  },
  { 
    id: 'emergency',
    icon: 'fa-truck-medical', 
    title: 'Emergency Medicine', 
    description: 'Prompt and efficient care for acute medical conditions. Available at affiliated clinics providing stabilized care and rapid intervention for critical health situations.',
    features: ['Acute Illness', 'Medical Stabilization', 'Urgent Care', 'Hospital Admission Coordination']
  },
];

export default function ServicesPage() {
  return (
    <>
      <ParallaxSection
        backgroundImage="/images/clinic-interior.png"
        overlayGradient="linear-gradient(135deg, rgba(13,148,136,0.92), rgba(30,64,175,0.92))"
        minHeight="350px"
      >
        <div className={styles.pageHero}>
          <h1>Medical Services</h1>
          <p>Comprehensive healthcare tailored to your needs</p>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span>/</span> <span>Services</span>
          </nav>
        </div>
      </ParallaxSection>

      <section className="section bg-secondary">
        <div className="container">
          <div className={styles.intro}>
            <ScrollRevealClient>
              <h2 className="section-title" style={{textAlign: 'center'}}>Specialized Care You Can Trust</h2>
              <p className="section-subtitle" style={{textAlign: 'center', marginBottom: '3rem'}}>
                Dr. Bharat Baishya provides a wide range of medical services with a focus on holistic and evidence-based treatment protocols.
              </p>
            </ScrollRevealClient>
          </div>

          <div className={styles.servicesList}>
            {services.map((svc, i) => (
              <ScrollRevealClient key={svc.id} delay={i * 100} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div id={svc.id} className={`card ${styles.serviceDetailCard}`}>
                  <div className={styles.serviceIconWrap}>
                    <i className={`fa-solid ${svc.icon}`}></i>
                  </div>
                  <div className={styles.serviceContent}>
                    <h3>{svc.title}</h3>
                    <p>{svc.description}</p>
                    <ul className={styles.featureList}>
                      {svc.features.map(feat => (
                        <li key={feat}><i className="fa-solid fa-check"></i> {feat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollRevealClient>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ specifically for services */}
       <section className="section" id="faq">
        <div className="container">
          <ScrollRevealClient>
            <div className="section-header">
              <div className="section-badge">
                <i className="fa-solid fa-circle-question"></i> Treatment FAQs
              </div>
              <h2 className="section-title">Common Service Inquiries</h2>
            </div>
          </ScrollRevealClient>
          <div className={styles.faqGrid}>
            {[
              { q: 'Do you treat Type 1 and Type 2 Diabetes?', a: 'Yes, Dr. Bharat Baishya provides comprehensive management for both Type 1 and Type 2 Diabetes, including insulin therapy management and lifestyle counseling.' },
              { q: 'What is included in a preventive health checkup?', a: 'A standard preventive checkup includes a physical examination, blood pressure monitoring, blood sugar testing, lipid profile analysis, and personalized lifestyle recommendations based on your risk factors.' },
              { q: 'Can I consult for common illnesses like fever or flu?', a: 'Absolutely. As a consultant physician in Internal Medicine, Dr. Bharat Baishya routinely diagnoses and treats common acute illnesses, infections, and respiratory issues.' },
            ].map((faq, i) => (
              <ScrollRevealClient key={i} delay={i * 80}>
                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>{faq.q}</span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </summary>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </details>
              </ScrollRevealClient>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{textAlign: 'center', background: 'var(--primary-50)'}}>
        <div className="container">
          <ScrollRevealClient>
            <h2 className="section-title">Ready to improve your health?</h2>
            <p style={{marginBottom: '2rem', color: 'var(--text-secondary)'}}>Schedule a consultation with Dr. Bharat Baishya today.</p>
            <Link href="/appointment" className="btn btn-primary btn-lg">
              Book Your Appointment Now
            </Link>
          </ScrollRevealClient>
        </div>
      </section>
    </>
  );
}
