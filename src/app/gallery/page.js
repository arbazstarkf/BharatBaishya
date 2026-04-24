import Link from 'next/link';
import ParallaxSection from '@/components/ParallaxSection';
import GalleryClient from './GalleryClient';
import styles from './gallery.module.css';

export const metadata = {
  title: 'Gallery | Dr. Bharat Baishya',
  description: 'View photos of Dr. Bharat Baishya\'s clinics, facilities, and medical events',
  alternates: { canonical: 'https://drbharatassam.com/gallery' },
};

const galleryImages = [
  { src: '/images/clinic-interior.png', alt: 'Sparsh Hospital Interior', width: 800, height: 600 },
  { src: '/images/doctor-portrait.png', alt: 'Dr. Bharat Baishya Consulting', width: 600, height: 800 },
  { src: '/images/clinic-interior.png', alt: 'Residence Clinic', width: 800, height: 500 },
  { src: '/images/doctor-portrait.png', alt: 'Medical Camp in Assam', width: 800, height: 800 },
  { src: '/images/clinic-interior.png', alt: 'Modern Medical Equipment', width: 600, height: 400 },
  { src: '/images/doctor-portrait.png', alt: 'Dr. Baishya at a Medical Conference', width: 800, height: 600 },
  { src: '/images/clinic-interior.png', alt: 'Waiting Area at Sparsh Hospital', width: 900, height: 600 },
  { src: '/images/doctor-portrait.png', alt: 'Patient Consultation', width: 600, height: 600 },
];

export default function GalleryPage() {
  return (
    <>
      <ParallaxSection
        backgroundImage="/images/clinic-interior.png"
        overlayGradient="linear-gradient(135deg, rgba(13,148,136,0.92), rgba(30,64,175,0.92))"
        minHeight="350px"
      >
        <div className={styles.pageHero}>
          <h1>Photo Gallery</h1>
          <p>A glimpse into Dr. Bharat Baishya's Practice</p>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span>/</span> <span>Gallery</span>
          </nav>
        </div>
      </ParallaxSection>

      <section className="section">
        <div className="container">
          <GalleryClient images={galleryImages} />
        </div>
      </section>
    </>
  );
}
