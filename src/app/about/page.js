import Image from 'next/image';
import Link from 'next/link';
import ParallaxSection from '@/components/ParallaxSection';
import ScrollRevealClient from './ScrollRevealClient';
import Affiliations from '@/components/Affiliations';
import styles from './about.module.css';

export const metadata = {
  title: 'About Dr. Bharat Baishya',
  description:
    'Learn about Dr. Bharat Baishya — MBBS, MD (Internal Medicine), CCEBDM, FICP. A consultant physician and diabetes specialist with 20+ years of experience serving Assam and North-East India.',
  alternates: { canonical: 'https://drbharatassam.com/about' },
};

const qualifications = [
  { abbr: 'MBBS', full: 'Bachelor of Medicine, Bachelor of Surgery' },
  { abbr: 'MD', full: 'Doctor of Medicine (Internal Medicine)' },
  { abbr: 'CCEBDM', full: 'Certificate Course in Evidence-Based Diabetes Management' },
  { abbr: 'FICP', full: 'Fellow of Indian College of Physicians' },
];

const milestones = [
  { year: '2000', title: 'Began Medical Practice', desc: 'Started serving patients as a consultant physician in Assam.' },
  { year: '2005', title: 'MD in Internal Medicine', desc: 'Earned Doctor of Medicine degree specializing in Internal Medicine.' },
  { year: '2010', title: 'Diabetes Specialization', desc: 'Completed CCEBDM certification for evidence-based diabetes management.' },
  { year: '2015', title: 'FICP Fellowship', desc: 'Awarded Fellowship of Indian College of Physicians.' },
  { year: '2018', title: 'Sparsh Hospital Association', desc: 'Joined Sparsh Hospital, Rangia as a leading consultant physician.' },
  { year: '2023', title: '20+ Years Milestone', desc: 'Celebrated over two decades of compassionate healthcare service.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <ParallaxSection
        backgroundImage="/images/clinic-interior.png"
        overlayGradient="linear-gradient(135deg, rgba(13,148,136,0.92), rgba(30,64,175,0.92))"
        minHeight="350px"
        id="about-hero"
      >
        <div className={styles.pageHero}>
          <h1>About Dr. Bharat Baishya</h1>
          <p>Two decades of compassionate healthcare excellence</p>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span>/</span> <span>About</span>
          </nav>
        </div>
      </ParallaxSection>

      {/* Doctor Story */}
      <section className="section">
        <div className="container">
          <div className={styles.storyGrid}>
            <ScrollRevealClient direction="left">
              <div className={styles.storyImage}>
                <Image
                  src="/images/doctor-portrait.png"
                  alt="Dr. Bharat Baishya"
                  width={500}
                  height={600}
                  className={styles.storyImg}
                />
              </div>
            </ScrollRevealClient>
            <ScrollRevealClient direction="right">
              <div className={styles.storyContent}>
                <div className="section-badge">
                  <i className="fa-solid fa-heart-pulse"></i> My Journey
                </div>
                <h2 className="section-title">A Passion for Healing</h2>
                <p>
                  For over 20 years, I have dedicated my life to providing the highest standard
                  of medical care to the people of Assam and North-East India. My journey in
                  medicine began with a deep desire to serve communities where quality healthcare
                  was most needed.
                </p>
                <p>
                  Specializing in Internal Medicine and Diabetes Management, I believe in
                  treating every patient as a whole person — not just their symptoms. My approach
                  combines the latest evidence-based medical practices with genuine compassion
                  and personalized attention.
                </p>
                <p>
                  Through my practice at Sparsh Hospital in Rangia, my residence clinic, and
                  Tamulpur Hospital in Baksa, I strive to make quality healthcare accessible
                  to everyone in the region.
                </p>
                <Link href="/appointment" className="btn btn-primary">
                  <i className="fa-solid fa-calendar-check"></i> Book a Consultation
                </Link>
              </div>
            </ScrollRevealClient>
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className={`section ${styles.qualSection}`}>
        <div className="container">
          <ScrollRevealClient>
            <div className="section-header">
              <div className="section-badge"><i className="fa-solid fa-graduation-cap"></i> Qualifications</div>
              <h2 className="section-title">Education &amp; Credentials</h2>
            </div>
          </ScrollRevealClient>
          <div className={styles.qualGrid}>
            {qualifications.map((q, i) => (
              <ScrollRevealClient key={q.abbr} delay={i * 100}>
                <div className={`card ${styles.qualCard}`}>
                  <div className={styles.qualAbbr}>{q.abbr}</div>
                  <p className={styles.qualFull}>{q.full}</p>
                </div>
              </ScrollRevealClient>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <ParallaxSection
        backgroundImage="/images/doctor-portrait.png"
        overlayGradient="linear-gradient(135deg, rgba(13,148,136,0.92), rgba(30,64,175,0.92))"
        minHeight="300px"
        id="achievements"
      >
        <div className={styles.achievementsContent}>
          <ScrollRevealClient>
            <h2>Achievements &amp; Recognition</h2>
            <div className={styles.achievementsGrid}>
              <div className={styles.achievementItem}>
                <i className="fa-solid fa-trophy"></i>
                <h4>Excellence in Medicine</h4>
                <p>Recognized for outstanding contribution to internal medicine in North-East India.</p>
              </div>
              <div className={styles.achievementItem}>
                <i className="fa-solid fa-award"></i>
                <h4>Best Physician Award</h4>
                <p>Awarded by regional medical associations for exceptional patient care and clinical outcomes.</p>
              </div>
              <div className={styles.achievementItem}>
                <i className="fa-solid fa-certificate"></i>
                <h4>Research Contributions</h4>
                <p>Published research on diabetes management strategies relevant to the North-East Indian population.</p>
              </div>
            </div>
          </ScrollRevealClient>
        </div>
      </ParallaxSection>

      {/* Milestones Timeline */}
      <section className="section">
        <div className="container">
          <ScrollRevealClient>
            <div className="section-header">
              <div className="section-badge"><i className="fa-solid fa-road"></i> Milestones</div>
              <h2 className="section-title">Journey Through the Years</h2>
            </div>
          </ScrollRevealClient>
          <div className={styles.timeline}>
            {milestones.map((m, i) => (
              <ScrollRevealClient key={m.year} delay={i * 100} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className={`${styles.timelineItem} ${i % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}>
                  <div className={styles.timelineDot}></div>
                  <div className={`card ${styles.timelineCard}`}>
                    <span className={styles.timelineYear}>{m.year}</span>
                    <h4>{m.title}</h4>
                    <p>{m.desc}</p>
                  </div>
                </div>
              </ScrollRevealClient>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <Affiliations />
    </>
  );
}
