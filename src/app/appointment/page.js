import Link from 'next/link';
import ParallaxSection from '@/components/ParallaxSection';
import AppointmentForm from '@/components/AppointmentForm';
import ScrollRevealClient from '../about/ScrollRevealClient';
import styles from './appointment.module.css';

export const metadata = {
  title: 'Book an Appointment | Dr. Bharat Baishya',
  description: 'Schedule your medical consultation with Dr. Bharat Baishya at Sparsh Hospital or the Residence Clinic in Rangia, Assam.',
  alternates: { canonical: 'https://drbharatassam.com/appointment' },
};

export default function AppointmentPage() {
  return (
    <>
      <ParallaxSection
        backgroundImage="/images/clinic-interior.png"
        overlayGradient="linear-gradient(135deg, rgba(13,148,136,0.92), rgba(30,64,175,0.92))"
        minHeight="300px"
      >
        <div className={styles.pageHero}>
          <h1>Book an Appointment</h1>
          <p>Schedule your visit for expert medical consultation</p>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span>/</span> <span>Appointment</span>
          </nav>
        </div>
      </ParallaxSection>

      <section className="section bg-secondary">
        <div className="container">
          <div className={styles.appointmentLayout}>
            
            <ScrollRevealClient direction="left">
              <div className={styles.sidebar}>
                <div className="section-badge">
                  <i className="fa-solid fa-clock"></i> Consultation Hours
                </div>
                <h2>When to Visit</h2>
                <p className={styles.sidebarDesc}>
                  Please review the consultation hours before booking. The aim is to confirm all online appointments within a few hours.
                </p>

                <div className={styles.timingList}>
                  <div className={`card ${styles.timingCard}`}>
                    <div className={styles.timingIcon}><i className="fa-solid fa-hospital"></i></div>
                    <div>
                      <h4>Sparsh Hospital</h4>
                      <p>Monday - Saturday</p>
                      <span className={styles.timeBadge}>11:00 AM – 5:00 PM</span>
                    </div>
                  </div>

                  <div className={`card ${styles.timingCard}`}>
                    <div className={styles.timingIcon}><i className="fa-solid fa-house-medical"></i></div>
                    <div>
                      <h4>Residency</h4>
                      <p>Monday - Saturday</p>
                      <span className={styles.timeBadge}>6:00 PM – 8:00 PM</span>
                    </div>
                  </div>

                  <div className={`card ${styles.timingCard}`}>
                    <div className={styles.timingIcon}><i className="fa-solid fa-hospital"></i></div>
                    <div>
                      <h4>Tamulpur</h4>
                      <p>Saturday Only</p>
                      <span className={styles.timeBadge}>Timings vary</span>
                    </div>
                  </div>
                </div>

                <div className={styles.emergencyNote}>
                  <h4><i className="fa-solid fa-truck-medical"></i> Emergency?</h4>
                  <p>In case of a medical emergency, do not wait for an online appointment confirmation. Call directly or visit the nearest hospital.</p>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <a href="tel:+919854004813" className="btn btn-secondary" style={{ width: '100%' }}>
                      <i className="fa-solid fa-phone"></i> +91 9854004813
                    </a>
                    <p style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0, color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Please read our <Link href="/whatsapp-policy" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>Communication Policy</Link> before calling or messaging for non-emergencies.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollRevealClient>

            <ScrollRevealClient direction="right">
              <div className={styles.formContainer}>
                <div className={`card ${styles.formCard}`}>
                  <div className={styles.formHeader}>
                    <h3>Online Booking Form</h3>
                    <p>Fill out the details below and the team will confirm your slot.</p>
                  </div>
                  <AppointmentForm compact={false} />
                </div>
              </div>
            </ScrollRevealClient>

          </div>
        </div>
      </section>
    </>
  );
}
