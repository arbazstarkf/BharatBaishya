'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Dr. Baishya' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Health Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/appointment', label: 'Book Appointment' },
  { href: '/whatsapp-policy', label: 'Communication Policy' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/disclaimer', label: 'Disclaimer' },
];

const services = [
  'Internal Medicine',
  'Diabetes Management',
  'Chronic Disease Care',
  'Preventive Checkups',
  'Lifestyle Counseling',
  'Emergency Medicine',
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <footer className={styles.footer} id="site-footer">
      {/* Top CTA */}
      {!['/services', '/gallery', '/blog', '/contact', '/appointment', '/whatsapp-policy'].includes(pathname) && !pathname.startsWith('/blog/') && (
        <div className={styles.ctaBanner}>
          <div className={`container ${styles.ctaInner}`}>
            <div className={styles.ctaText}>
              <h3>Need Medical Consultation?</h3>
              <p>Book your appointment today with Dr. Bharat Baishya</p>
            </div>
            <div className={styles.ctaActions}>
              <Link href="/appointment" className="btn btn-white btn-lg">
                <i className="fa-solid fa-calendar-check"></i>
                Book Appointment
              </Link>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <a href="https://wa.me/919854004813" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>
                  <i className="fa-brands fa-whatsapp"></i>
                  WhatsApp
                </a>
                <Link href="/whatsapp-policy" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'underline', textAlign: 'center' }}>
                  View Communication Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer */}
      <div className={styles.main}>
        <div className={`container ${styles.grid}`}>
          {/* Column 1: About */}
          <div className={styles.col}>
            <div className={styles.footerLogo}>
              <span className={styles.logoIcon}>
                <i className="fa-solid fa-heart-pulse"></i>
              </span>
              <div>
                <h4>Dr. Bharat Baishya</h4>
                <p className={styles.tagline}>MBBS, MD, CCEBDM, FICP</p>
              </div>
            </div>
            <p className={styles.aboutText}>
              Consultant physician with over 20 years of experience in Internal Medicine
              and Diabetes Management. Dedicated to providing compassionate healthcare
              to the people of Assam and North-East India.
            </p>
            <div className={styles.social}>
              <a href="https://www.facebook.com/bharatfacebookbaishya" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/bharatinstabaishyas" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://wa.me/919854004813" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.socialLink}>
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a href="mailto:drbharatbaishya@gmail.com" aria-label="Email" className={styles.socialLink}>
                <i className="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkListTwoCols}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.footerLink}>
                    <i className="fa-solid fa-chevron-right"></i>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.linkList}>
              {services.map((service) => (
                <li key={service}>
                  <Link href="/services" className={styles.footerLink}>
                    <i className="fa-solid fa-chevron-right"></i>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact Info</h4>
            <ul className={styles.contactList}>
              <li>
                <i className="fa-solid fa-phone"></i>
                <div>
                  <p className={styles.contactLabel}>Phone / WhatsApp</p>
                  <a href="tel:+919854004813">+91 9854004813</a>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <p className={styles.contactLabel}>Email</p>
                  <a href="mailto:drbharatbaishya@gmail.com">drbharatbaishya@gmail.com</a>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-clock"></i>
                <div>
                  <p className={styles.contactLabel}>Sparsh Hospital</p>
                  <span>Mon–Sat: 11:00 AM – 5:00 PM</span>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-house-medical"></i>
                <div>
                  <p className={styles.contactLabel}>Residency, Rangia</p>
                  <span>Mon–Sat: 6:00 PM – 8:00 PM</span>
                </div>
              </li>
              <li>
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <p className={styles.contactLabel}>Tamulpur</p>
                  <span>Saturday Only, Timings may vary</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>&copy; {new Date().getFullYear()} Dr. Bharat Baishya. All rights reserved.</p>
          <p className={styles.bottomRight}>
            Sunday: Closed &nbsp;•&nbsp; For emergencies, call{' '}
            <a href="tel:+919854004813">+91 9854004813</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
