import Link from 'next/link';
import ParallaxSection from '@/components/ParallaxSection';
import ScrollRevealClient from '../about/ScrollRevealClient';
import styles from './contact.module.css';

export const metadata = {
  title: 'Contact Us | Dr. Bharat Baishya',
  description: 'Get in touch with Dr. Bharat Baishya for medical consultations. Find clinic hours and locations in Rangia and Tamulpur, Assam.',
  alternates: { canonical: 'https://drbharatassam.com/contact' },
};

export default function ContactPage() {
  return (
    <>
      <ParallaxSection
        backgroundImage="/images/clinic-interior.png"
        overlayGradient="linear-gradient(135deg, rgba(13,148,136,0.92), rgba(30,64,175,0.92))"
        minHeight="350px"
      >
        <div className={styles.pageHero}>
          <h1>Contact Us</h1>
          <p>Dedicated to assist you with your healthcare needs</p>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span>/</span> <span>Contact</span>
          </nav>
        </div>
      </ParallaxSection>

      <section className="section bg-secondary">
        <div className="container">
          <div className={styles.contactGrid}>

            {/* Contact Information */}
            <ScrollRevealClient direction="left">
              <div className={styles.contactInfo}>
                <div className="section-badge">
                  <i className="fa-solid fa-headset"></i> Get In Touch
                </div>
                <h2 className="section-title">Always Here To Help You</h2>
                <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                  For appointments, general inquiries, or medical emergencies, please reach out via phone.
                  You can also visit clinics during consultation hours.
                </p>

                <div className={styles.infoCards}>
                  <div className={`card ${styles.infoCard}`}>
                    <div className={styles.infoIcon}><i className="fa-solid fa-phone"></i></div>
                    <div>
                      <h4>Call (Appointments)</h4>
                      <p><a href="tel:+919854004813">+91 9854004813</a></p>
                    </div>
                  </div>

                  <div className={`card ${styles.infoCard}`}>
                    <div className={styles.infoIcon}><i className="fa-brands fa-whatsapp"></i></div>
                    <div>
                      <h4>WhatsApp Message</h4>
                      <p>
                        <a href="https://wa.me/919854004813" target="_blank" rel="noopener noreferrer">+91 9854004813</a>
                      </p>
                      <Link href="/whatsapp-policy" className={styles.policyLink}>
                        Read Communication Policy
                      </Link>
                    </div>
                  </div>

                  <div className={`card ${styles.infoCard}`}>
                    <div className={styles.infoIcon}><i className="fa-regular fa-envelope"></i></div>
                    <div>
                      <h4>Email Address</h4>
                      <p><a href="mailto:drbharatbaishya@gmail.com">drbharatbaishya@gmail.com</a></p>
                    </div>
                  </div>
                </div>

                <div className={styles.actionWrap}>
                  <Link href="/appointment" className="btn btn-primary btn-lg">
                    Book Appointment Online <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </ScrollRevealClient>

            {/* Clinic Locations */}
            <ScrollRevealClient direction="right">
              <div className={styles.locationsWrap}>
                <h3 style={{ marginBottom: '1.5rem' }}> Clinics</h3>

                <div className={`card ${styles.locCard}`}>
                  <div className={styles.locHeader}>
                    <i className="fa-solid fa-hospital"></i>
                    <h4>Sparsh Hospital</h4>
                  </div>
                  <div className={styles.locDetails}>
                    <p><i className="fa-solid fa-map-pin"></i> Station Road, Ward No 2, Rangia, Kamrup, Assam</p>
                    <p><i className="fa-regular fa-clock"></i> <strong>Mon–Sat:</strong> 11:00 AM – 5:00 PM</p>
                  </div>
                </div>

                <div className={`card ${styles.locCard}`}>
                  <div className={styles.locHeader}>
                    <i className="fa-solid fa-house-medical"></i>
                    <h4>Residency</h4>
                  </div>
                  <div className={styles.locDetails}>
                    <p><i className="fa-solid fa-map-pin"></i> Ward No 3, Dharampur, Opposite Highway Chef Dhaba, Rangia, Kamrup, Assam</p>
                    <p><i className="fa-regular fa-clock"></i> <strong>Mon–Sat:</strong> 6:00 PM – 8:00 PM</p>
                  </div>
                </div>

                <div className={`card ${styles.locCard}`}>
                  <div className={styles.locHeader}>
                    <i className="fa-solid fa-hospital"></i>
                    <h4>Tamulpur </h4>
                  </div>
                  <div className={styles.locDetails}>
                    <p><i className="fa-solid fa-map-pin"></i> Tamulpur, Baksa, Assam</p>
                    <p><i className="fa-regular fa-clock"></i> <strong>Saturday Only</strong> , Timings may vary </p>
                  </div>
                </div>

                <div className={styles.noteBox}>
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <p><strong>Note:</strong> Not Available on Sundays.</p>
                </div>

              </div>
            </ScrollRevealClient>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <div className="container">
          <ScrollRevealClient>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Find Me in Rangia</h2>
            <div className={styles.mapGrid}>
              <div className={styles.mapBox}>
                <div className={styles.mapLabel}><i className="fa-solid fa-hospital"></i> Sparsh Hospital</div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.4981162528816!2d91.60955066048612!3d26.439668080164232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375bb3655f99f8c9%3A0x9535f9f64f54b51e!2sSparsh%20Hospital%2CRangia!5e0!3m2!1sen!2sus!4v1776352032591!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sparsh Hospital Location Map"
                ></iframe>
              </div>

              <div className={styles.mapBox}>
                <div className={styles.mapLabel}><i className="fa-solid fa-house-medical"></i> Residency</div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1057.6587883254804!2d91.62468621464792!3d26.43058238353904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375bb33d18dde993%3A0xfb32dde0c5ea83ff!2sNew%20Highway%20Chef%20Dhaba!5e0!3m2!1sen!2sus!4v1776352121143!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Residency Location Map"
                ></iframe>
              </div>
            </div>
          </ScrollRevealClient>
        </div>
      </section>
    </>
  );
}
