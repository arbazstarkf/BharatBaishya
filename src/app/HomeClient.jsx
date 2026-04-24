'use client';

import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedCounter from '@/components/AnimatedCounter';
import ParallaxSection from '@/components/ParallaxSection';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import BlogCard from '@/components/BlogCard';
import { blogs } from '@/data/blogs';
import Affiliations from '@/components/Affiliations';
import styles from './Home.module.css';

const services = [
  { icon: 'fa-stethoscope', title: 'Internal Medicine', description: 'Comprehensive diagnosis and treatment of adult diseases with a holistic approach to your health and well-being.' },
  { icon: 'fa-droplet', title: 'Diabetes Management', description: 'Evidence-based diabetes care with personalized treatment plans, including lifestyle counseling and medication management.' },
  { icon: 'fa-heart-pulse', title: 'Chronic Disease Care', description: 'Long-term management of hypertension, thyroid disorders, and other chronic conditions with regular monitoring.' },
  { icon: 'fa-shield-heart', title: 'Preventive Checkups', description: 'Comprehensive health screenings to detect potential health issues early and maintain optimal wellness.' },
  { icon: 'fa-apple-whole', title: 'Lifestyle Counseling', description: 'Personalized diet and lifestyle recommendations to help you achieve better health outcomes naturally.' },
  { icon: 'fa-truck-medical', title: 'Emergency Medicine', description: 'Prompt and efficient emergency medical care when you need it most, available at reachable locations.' },
];

const testimonials = [
  { name: 'Rajesh Kalita', text: 'Dr. Baishya has been managing my diabetes for over 5 years. His expertise and caring nature make every visit reassuring. My sugar levels are perfectly controlled now.', rating: 5, location: 'Rangia, Assam' },
  { name: 'Priya Sharma', text: 'The best doctor in the region. Dr. Bharat Baishya takes time to listen and explain everything clearly. I recommend him to everyone in my family.', rating: 5, location: 'Nalbari, Assam' },
  { name: 'Mohan Das', text: 'After visiting many doctors, I finally found the right one. Dr. Bharat Baishya diagnosed my condition accurately and his friendly behaviour makes patients feel at ease. The treatment has been incredibly effective.', rating: 5, location: 'Tamulpur, Assam' },
  { name: 'Barasha Deka', text: 'Undoubtedly the best doctor in Rangia. I have visited him multiple times for my parents, and his friendly behaviour always calms them down. His expertise in general medicine is commendable.', rating: 5, location: 'Rangia, Assam' },
  { name: 'Kangkan Kalita', text: 'His expertise in treating thyroid conditions is unmatched. Dr. Bharat Baishya provides the most reliable treatment in the Nalbari region. Truly the best doctor around.', rating: 5, location: 'Nalbari, Assam' },
  { name: 'Sunil Boro', text: 'What makes Dr. Bharat Baishya the best doctor is his friendly behaviour. He never rushes his patients. Best Doctor in Tamulpur for any kind of fever or illness.', rating: 5, location: 'Tamulpur, Assam' },
  { name: 'Anita Devi', text: 'Very professional and knowledgeable doc with great expertise. The clinic at Sparsh Hospital is well-equipped and the staff is very friendly and helpful.', rating: 4, location: 'Rangia, Assam' },
  { name: 'Kushal Barman', text: 'If you want genuine advice and top-level expertise, you must visit Dr. Bharat Baishya. He is the best doctor for diabetes management in the area.', rating: 5, location: 'Nalbari, Assam' },
];

export default function HomeClient() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBg}></div>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroText}>
            <div className={styles.heroBadge}>
              <i className="fa-solid fa-heart-pulse"></i>
              20+ Years of Trusted Healthcare
            </div>
            <h1 className={styles.heroTitle}>
              Dr. Bharat <span className={styles.heroHighlight}>Baishya</span>
            </h1>
            <p className={styles.heroCredentials}>
              MBBS &bull; MD (Internal Medicine) &bull; CCEBDM &bull; FICP
            </p>
            <p className={styles.heroSubtitle}>
              Consultant Physician &amp; Diabetes Specialist serving Assam and
              North-East India with compassion and clinical excellence.
            </p>
            <div className={styles.heroCta}>
              <Link href="/appointment" className="btn btn-primary btn-lg">
                <i className="fa-solid fa-calendar-check"></i>
                Book Appointment
              </Link>
              <a
                href="https://wa.me/919854004813"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <i className="fa-brands fa-whatsapp"></i>
                WhatsApp
              </a>
            </div>
            <div className={styles.heroContact}>
              <a href="tel:+919854004813">
                <i className="fa-solid fa-phone"></i> +91 9854004813
              </a>
              <span className={styles.heroDivider}>|</span>
              <span>
                <i className="fa-solid fa-location-dot"></i> Rangia, Kamrup, Assam
              </span>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImageWrapper}>
              <Image
                src="/images/doctor-portrait.png"
                alt="Dr. Bharat Baishya - Consultant Physician"
                width={500}
                height={600}
                priority
                className={styles.doctorImg}
              />
            </div>
            <div className={styles.heroFloat1}>
              <i className="fa-solid fa-shield-heart"></i>
              <span>Certified Specialist</span>
            </div>
            <div className={styles.heroFloat2}>
              <i className="fa-solid fa-star"></i>
              <span>Trusted Care</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className={styles.stats} id="stats">
        <div className={`container ${styles.statsGrid}`}>
          <AnimatedCounter end={20} suffix="+" label="Years Experience" />
          <AnimatedCounter end={3} suffix="+" label="Locations" />
          <AnimatedCounter end={100} suffix="k+" label="Patients Served" />
          <AnimatedCounter end={5} suffix="+" label="Awards" />
        </div>
      </section>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="section" id="about-preview">
        <div className="container">
          <div className={styles.aboutGrid}>
            <ScrollReveal direction="left">
              <div className={styles.aboutImageWrap}>
                <Image
                  src="/images/clinic-interior.png"
                  alt="Dr. Bharat Baishya consulting with a patient"
                  width={600}
                  height={450}
                  className={styles.aboutImage}
                />
                <div className={styles.aboutImageBadge}>
                  <i className="fa-solid fa-award"></i>
                  <div>
                    <strong>FICP</strong>
                    <span>Fellow of Indian College of Physicians</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className={styles.aboutContent}>
                <div className="section-badge">
                  <i className="fa-solid fa-user-doctor"></i> About Dr. Baishya
                </div>
                <h2 className="section-title">Dedicated to Your Health &amp; Wellness</h2>
                <p>
                  With over two decades of experience in Internal Medicine and
                  Diabetes Management, Dr. Bharat Baishya has been a cornerstone
                  of healthcare in Assam and North-East India.
                </p>
                <p>
                  Holding qualifications including MBBS, MD (Internal Medicine),
                  CCEBDM (Certificate Course in Evidence-Based Diabetes
                  Management), and FICP (Fellow of Indian College of
                  Physicians), he combines deep clinical expertise with
                  genuine compassion for every patient.
                </p>
                <div className={styles.aboutFeatures}>
                  <div className={styles.aboutFeature}>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Evidence-based treatment protocols</span>
                  </div>
                  <div className={styles.aboutFeature}>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Personalized patient care plans</span>
                  </div>
                  <div className={styles.aboutFeature}>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Modern diagnostic approach</span>
                  </div>
                  <div className={styles.aboutFeature}>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Affiliated with leading hospitals</span>
                  </div>
                </div>
                <Link href="/about" className="btn btn-primary">
                  Learn More About Dr. Bharat Baishya <i className="fa-solid fa-arrow-right"></i>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className={`section ${styles.servicesSection}`} id="services">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <div className="section-badge">
                <i className="fa-solid fa-briefcase-medical"></i> Services
              </div>
              <h2 className="section-title">Comprehensive Healthcare Services</h2>
              <p className="section-subtitle">
                Expert medical care across multiple specializations, tailored to meet
                your unique health needs.
              </p>
            </div>
          </ScrollReveal>
          <div className={styles.servicesGrid}>
            {services.map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 100}>
                <ServiceCard {...service} index={i} />
              </ScrollReveal>
            ))}
          </div>
          <div className={styles.servicesCta}>
            <Link href="/services" className="btn btn-primary">
              View All Services <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PARALLAX CTA ===== */}
      <ParallaxSection
        backgroundImage="/images/clinic-interior.png"
        overlayGradient="linear-gradient(135deg, rgba(13,148,136,0.9), rgba(30,64,175,0.9))"
        minHeight="350px"
        id="cta-parallax"
      >
        <div className={styles.parallaxCta}>
          <ScrollReveal>
            <h2>Your Health Is My Priority</h2>
            <p>
              Don&apos;t wait for symptoms to become serious. Schedule a consultation
              with Dr. Bharat Baishya today.
            </p>
            <div className={styles.parallaxCtaBtns}>
              <Link href="/appointment" className="btn btn-white btn-lg">
                <i className="fa-solid fa-calendar-check"></i>
                Book Appointment
              </Link>
              <a href="tel:+919854004813" className="btn btn-secondary btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>
                <i className="fa-solid fa-phone"></i>
                Call Now
              </a>
            </div>
          </ScrollReveal>
        </div>
      </ParallaxSection>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section" id="testimonials">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <div className="section-badge">
                <i className="fa-solid fa-quote-left"></i> Testimonials
              </div>
              <h2 className="section-title">What Patients Say</h2>
              <p className="section-subtitle">
                Trusted by thousands of patients across Assam and North-East India.
              </p>
            </div>
          </ScrollReveal>
          <div className={styles.testimonialsWrapper}>
            <div className={styles.testimonialsScroll}>
              <div className={styles.testimonialsGrid}>
                {testimonials.map((t, i) => (
                  <div key={`t1-${i}`}>
                    <TestimonialCard {...t} />
                  </div>
                ))}
              </div>
              <div className={styles.testimonialsGrid} aria-hidden="true">
                {testimonials.map((t, i) => (
                  <div key={`t2-${i}`}>
                    <TestimonialCard {...t} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOCATIONS ===== */}
      <section className={`section ${styles.locationsSection}`} id="locations">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <div className="section-badge">
                <i className="fa-solid fa-location-dot"></i> Locations
              </div>
              <h2 className="section-title">Visit Dr. Baishya At</h2>
              <p className="section-subtitle">
                Conveniently located across Kamrup and Baksa.
              </p>
            </div>
          </ScrollReveal>
          <div className={styles.locationsGrid}>
            {[
              {
                name: 'Sparsh Hospital',
                address: 'Ward No 2, Station Road, Rangia, Kamrup, Assam',
                hours: 'Mon–Sat: 11:00 AM – 5:00 PM',
                icon: 'fa-hospital',
                mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.4981162528816!2d91.60955066048612!3d26.439668080164232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375bb3655f99f8c9%3A0x9535f9f64f54b51e!2sSparsh%20Hospital%2CRangia!5e0!3m2!1sen!2sus!4v1776352032591!5m2!1sen!2sus',
              },
              {
                name: 'Residency',
                address: 'Ward No 3, Opposite New Highway Chef Dhaba, Rangia, Kamrup, Assam',
                hours: 'Mon–Sat: 6:00 PM – 8:00 PM',
                icon: 'fa-house-medical',
                mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1057.6587883254804!2d91.62468621464792!3d26.43058238353904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375bb33d18dde993%3A0xfb32dde0c5ea83ff!2sNew%20Highway%20Chef%20Dhaba!5e0!3m2!1sen!2sus!4v1776352121143!5m2!1sen!2sus',
              },
              {
                name: 'Tamulpur',
                address: 'ABC Place, ABC Clinic, ABC Road, Tamulpur, Baksa, Assam',
                hours: 'Saturday Only: 6:00 PM – 8:00 PM',
                icon: 'fa-hospital',
                mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14264.753080444047!2d91.56406524684537!3d26.6424538084204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375bb9b88aa466a5%3A0x72140dca69d60ba2!2sTamulpur%2C%20Assam%20781367%2C%20India!5e0!3m2!1sen!2sus!4v1776352187690!5m2!1sen!2sus',
              },
            ].map((loc, i) => (
              <ScrollReveal key={loc.name} delay={i * 150}>
                <div className={`card ${styles.locationCard}`}>
                  <div className={styles.locationIcon}>
                    <i className={`fa-solid ${loc.icon}`}></i>
                  </div>
                  <h3>{loc.name}</h3>
                  <p className={styles.locationAddress}>
                    <i className="fa-solid fa-map-pin"></i> {loc.address}
                  </p>
                  <p className={styles.locationHours}>
                    <i className="fa-regular fa-clock"></i> {loc.hours}
                  </p>
                  <div className={styles.mapFrame}>
                    <iframe
                      src={loc.mapSrc}
                      width="100%"
                      height="180"
                      style={{ border: 0, borderRadius: '0.5rem' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map - ${loc.name}`}
                    ></iframe>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG PREVIEW ===== */}
      <section className="section" id="blog-preview">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <div className="section-badge">
                <i className="fa-solid fa-newspaper"></i> Health Blog
              </div>
              <h2 className="section-title">Latest Health Articles</h2>
              <p className="section-subtitle">
                Stay informed with expert medical insights from Dr. Bharat Baishya.
              </p>
            </div>
          </ScrollReveal>
          <div className={styles.blogGrid}>
            {blogs.map((blog, i) => (
              <ScrollReveal key={blog.slug} delay={i * 100}>
                <BlogCard {...blog} />
              </ScrollReveal>
            ))}
          </div>
          <div className={styles.servicesCta}>
            <Link href="/blog" className="btn btn-primary">
              View All Articles <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== AFFILIATIONS ===== */}
      <Affiliations />

      {/* ===== FAQ ===== */}
      <section className="section" id="faq">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <div className="section-badge">
                <i className="fa-solid fa-circle-question"></i> FAQs
              </div>
              <h2 className="section-title">Frequently Asked Questions</h2>
            </div>
          </ScrollReveal>
          <div className={styles.faqGrid}>
            {[
              { q: 'What are Dr. Bharat Baishya\'s qualifications?', a: 'Dr. Bharat Baishya holds MBBS, MD (Internal Medicine), CCEBDM (Certificate Course in Evidence-Based Diabetes Management), and FICP (Fellow of Indian College of Physicians) degrees with over 20 years of clinical experience. His AMC Registration Number is 16525' },
              { q: 'Where does Dr. Bharat Baishya practice?', a: 'Dr. Bharat Baishya practices at three locations: Sparsh Hospital, Rangia (Mon-Sat 11AM-5PM), Residency, Rangia (Mon-Sat 6PM-8PM), and Tamulpur, Baksa (Saturdays only, Timings may differ).' },
              { q: 'How can I book an appointment?', a: 'You can book an appointment through our website\'s online booking form, by calling 03621-242005, or by sending a WhatsApp message to +91 9854004813.' },
              { q: 'Does Dr. Bharat Baishya specialize in diabetes treatment?', a: 'Yes, Dr. Bharat Baishya is a certified diabetes specialist holding CCEBDM certification and has extensive experience in evidence-based diabetes management practices.' },
              { q: 'Is Dr. Bharat Baishya available on Sundays?', a: 'No, Dr. Bharat Baishya is not available on Sundays. For medical emergencies, please call 03621-242005.' },
              { q: 'What services does Dr. Bharat Baishya offer?', a: 'Dr. Bharat Baishya offers Internal Medicine consultations, Diabetes Management, Chronic Disease Care, Preventive Health Checkups, Lifestyle & Diet Counseling, and Emergency Medicine services.' },
            ].map((faq, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <details className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>
                    <span>{faq.q}</span>
                    <i className="fa-solid fa-chevron-down"></i>
                  </summary>
                  <p className={styles.faqAnswer}>{faq.a}</p>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
        {/* FAQ Schema for AEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                { '@type': 'Question', name: 'What are Dr. Bharat Baishya\'s qualifications?', acceptedAnswer: { '@type': 'Answer', text: 'Dr. Bharat Baishya holds MBBS, MD (Internal Medicine), CCEBDM, and FICP degrees with over 20 years of clinical experience.' } },
                { '@type': 'Question', name: 'Where does Dr. Baishya practice?', acceptedAnswer: { '@type': 'Answer', text: 'Dr. Baishya practices at Sparsh Hospital Rangia, Residency Rangia, and Tamulpur  Baksa.' } },
                { '@type': 'Question', name: 'How can I book an appointment?', acceptedAnswer: { '@type': 'Answer', text: 'Book through the online form, call +91 9854004813, or WhatsApp the same number.' } },
              ],
            }),
          }}
        />
      </section>
    </>
  );
}
