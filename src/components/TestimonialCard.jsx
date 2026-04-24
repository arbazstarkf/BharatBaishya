import styles from './TestimonialCard.module.css';

export default function TestimonialCard({ name, text, rating = 5, location }) {
  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.stars}>
        {Array.from({ length: 5 }).map((_, i) => (
          <i
            key={i}
            className={`fa-${i < rating ? 'solid' : 'regular'} fa-star`}
          ></i>
        ))}
      </div>
      <p className={styles.text}>&ldquo;{text}&rdquo;</p>
      <div className={styles.author}>
        <div className={styles.avatar}>
          {name.charAt(0)}
        </div>
        <div>
          <p className={styles.name}>{name}</p>
          {location && <p className={styles.location}>{location}</p>}
        </div>
      </div>
    </div>
  );
}
