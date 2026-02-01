"use client";

import Image from 'next/image';
import styles from './JarHero.module.css';

export default function JarHero() {
  return (
    <section id="jar-hero-wrapper" className={styles.heroWrapper}>
      <div className={styles.stickyContainer}>
        <div className={styles.canvasWrapper}>
          <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <Image
              src="/hero-images/hero-image2.png"
              alt="Sareine Natural Balm"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          <div className={styles.overlayContainer}>
            <div className={styles.textGroup}>
              <p className={styles.tagline}>Natural Lip Balm</p>
              <h1 className={styles.headline}>Softness,<br/>Reimagined.</h1>
              <span className={styles.price}>₹599</span>

              <a href="#buy-now" className={styles.ctaButton}>Add to Cart</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
