import Link from 'next/link';
import Image from 'next/image';
import styles from './BlogCard.module.css';

export default function BlogCard({ slug, title, excerpt, image, date, readTime, category, layout = 'grid' }) {
  const cardClass = layout === 'list' ? `${styles.card} ${styles.listLayout}` : styles.card;

  return (
    <Link href={`/blog/${slug}`} className={`card ${cardClass}`}>
      <div className={styles.imageWrap}>
        <Image
          src={image}
          alt={title}
          width={600}
          height={340}
          className={styles.image}
        />
        {category && <span className={styles.category}>{category}</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span><i className="fa-regular fa-calendar"></i> {date}</span>
          <span><i className="fa-regular fa-clock"></i> {readTime}</span>
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <span className={styles.readMore}>
          Read More <i className="fa-solid fa-arrow-right"></i>
        </span>
      </div>
    </Link>
  );
}
