"use client";

import { useRef } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';

export default function HeroAnimation() {
  const ctaRef = useRef<HTMLAnchorElement>(null);

  return (
    <div className={styles.canvasWrapper}>
      <Reveal as="div" variant="image" className={styles.heroImageReveal}>
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
          <Image
            src="/hero-images/hero-image1.png"
            alt="Sareine Limited Edition"
            fill
            className={styles.heroImage}
            priority
            sizes="100vw"
          />
        </div>
      </Reveal>

      <div className={styles.overlayContainer}>
        <Reveal as="div" variant="section" delay={90} className={styles.textGroup}>
          <p className={styles.tagline}>SAREINE</p>
          <EditorialHeading
            as="h1"
            className={styles.headline}
            lines={["Pure Hydration", "from Nature"]}
            baseDelayMs={90}
            stepDelayMs={90}
          />
        </Reveal>

        <a ref={ctaRef} href="#contact" className={styles.ctaButton} role="button">
          Discover More
        </a>
      </div>
    </div>
  );
}
