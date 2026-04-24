import styles from './ServiceCard.module.css';

export default function ServiceCard({ icon, title, description, index = 0 }) {
  return (
    <div className={`card ${styles.card}`} style={{ animationDelay: `${index * 100}ms` }}>
      <div className={styles.iconWrap}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <div className={styles.decorLine}></div>
    </div>
  );
}
