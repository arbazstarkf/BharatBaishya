import Link from 'next/link';
import ParallaxSection from '@/components/ParallaxSection';
import BlogCard from '@/components/BlogCard';
import ScrollRevealClient from '../about/ScrollRevealClient';
import { blogs } from '@/data/blogs';
import styles from './blog.module.css';

export const metadata = {
  title: 'Health Blog | Dr. Bharat Baishya',
  description: 'Read the latest health articles, tips, and medical insights from Dr. Bharat Baishya, Consultant Physician and Diabetes Specialist.',
  alternates: { canonical: 'https://drbharatassam.com/blog' },
};

export default function BlogListingPage() {
  return (
    <>
      <ParallaxSection
        backgroundImage="/images/clinic-interior.png"
        overlayGradient="linear-gradient(135deg, rgba(13,148,136,0.92), rgba(30,64,175,0.92))"
        minHeight="350px"
      >
        <div className={styles.pageHero}>
          <h1>Health Insights &amp; Articles</h1>
          <p>Expert medical advice to help you live a healthier life</p>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <Link href="/">Home</Link> <span>/</span> <span>Blog</span>
          </nav>
        </div>
      </ParallaxSection>

      <section className="section bg-secondary">
        <div className="container">
          <div className={styles.blogGrid}>
            {blogs.map((blog, i) => (
              <ScrollRevealClient key={blog.slug} delay={i * 100}>
                <BlogCard {...blog} layout="list" />
              </ScrollRevealClient>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
