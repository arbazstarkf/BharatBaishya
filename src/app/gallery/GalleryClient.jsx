'use client';
import { useState } from 'react';
import Image from 'next/image';
import ScrollRevealClient from '../about/ScrollRevealClient';
import styles from './gallery.module.css';

export default function GalleryClient({ images }) {
  const [lightboxImg, setLightboxImg] = useState(null);

  const closeLightbox = () => setLightboxImg(null);

  return (
    <>
      <div className={styles.masonryGrid}>
        {images.map((img, i) => (
          <ScrollRevealClient key={i} delay={(i % 3) * 100}>
            <div 
              className={styles.imageWrap}
              onClick={() => setLightboxImg(img)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className={styles.image}
                style={{ width: '100%', height: 'auto' }}
              />
              <div className={styles.imageOverlay}>
                <i className="fa-solid fa-magnifying-glass-plus"></i>
                <span>{img.alt}</span>
              </div>
            </div>
          </ScrollRevealClient>
        ))}
      </div>

      {lightboxImg && (
        <div className={styles.lightboxOverlay} onClick={closeLightbox}>
          <button className={styles.lightboxClose} aria-label="Close" onClick={closeLightbox}>
            <i className="fa-solid fa-xmark"></i>
          </button>
          <div className={styles.lightboxContentWrap} onClick={e => e.stopPropagation()}>
            <Image
              src={lightboxImg.src}
              alt={lightboxImg.alt}
              width={lightboxImg.width}
              height={lightboxImg.height}
              className={styles.lightboxContent}
              style={{ width: '100%', height: 'auto' }}
            />
            <p className={styles.lightboxCaption}>{lightboxImg.alt}</p>
          </div>
        </div>
      )}
    </>
  );
}
