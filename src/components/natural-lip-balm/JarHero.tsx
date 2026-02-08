"use client";

import Image from 'next/image';
import styles from './JarHero.module.css';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';

export default function JarHero() {
  return (
    <section id="jar-hero-wrapper" className={styles.heroWrapper}>
      <div className={styles.stickyContainer}>
        <div className={styles.canvasWrapper}>
          <Reveal as="div" variant="image" className={styles.heroImageReveal}>
            <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
              <Image
                src="/hero-images/hero-image2.png"
                alt="Sareine Natural Balm"
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="100vw"
              />
            </div>
          </Reveal>

          <div className={styles.overlayContainer}>
            <Reveal as="div" variant="section" className={styles.textGroup} delay={80}>
              <p className={styles.tagline}>Natural Lip Balm</p>
              <EditorialHeading
                as="h1"
                className={styles.headline}
                lines={["Softness,", "Reimagined."]}
                baseDelayMs={90}
                stepDelayMs={90}
              />
              <span className={styles.price}>₹599</span>

              <a href="#buy-now" className={styles.ctaButton}>Add to Cart</a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
