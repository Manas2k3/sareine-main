"use client";

import { useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

export default function HeroAnimation() {
  const ctaRef = useRef<HTMLAnchorElement>(null);

  return (
    <div className={styles.canvasWrapper}>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <Image
          src="/hero-images/hero-image1.png"
          alt="Sareine Limited Edition"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      <div className={styles.overlayContainer}>
        <div className={styles.textGroup}>
          <p className={styles.tagline}>SAREINE</p>
          <h1 className={styles.headline}>Pure Hydration<br />from Nature</h1>
        </div>

        <a ref={ctaRef} href="#contact" className={styles.ctaButton} role="button">
          Discover More
        </a>
      </div>
    </div>
  );
}

