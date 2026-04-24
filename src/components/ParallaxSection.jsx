'use client';

import styles from './ParallaxSection.module.css';

export default function ParallaxSection({
  children,
  backgroundImage,
  overlayColor = 'rgba(0, 0, 0, 0.6)',
  overlayGradient,
  minHeight = '400px',
  className = '',
  id,
}) {
  const overlay = overlayGradient || overlayColor;

  return (
    <section
      className={`${styles.wrapper} ${className}`}
      style={{ minHeight }}
      id={id}
    >
      <div
        className={styles.bg}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundColor: backgroundImage ? undefined : 'var(--primary-800)',
        }}
      />
      <div
        className={styles.overlay}
        style={{ background: overlay }}
      />
      <div className={`${styles.content} container`}>
        {children}
      </div>
    </section>
  );
}
