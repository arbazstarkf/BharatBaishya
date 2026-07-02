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
  { src: '/images/img (1).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (2).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (3).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (4).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (5).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (6).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (7).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (8).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (9).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (10).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/img (11).JPG', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/bb1.jpg', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/bb2.jpg', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/bb4.jpg', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/bb5.jpg', alt: 'Gallery Image', width: 800, height: 600 },
  { src: '/images/bb6.jpg', alt: 'Gallery Image', width: 800, height: 600 },
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
