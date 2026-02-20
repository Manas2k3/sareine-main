"use client";

import { useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';
import WaitlistModal from '@/components/WaitlistModal';

export default function HeroAnimation() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Calculate percentage position of mouse within the container
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <>
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

        {/* FROSTED VAULT TEASER OVERLAY */}
        <div
          className={styles.frostedVaultContainer}
          onMouseMove={handleMouseMove}
          style={{
            '--mouse-x': `${mousePos.x}%`,
            '--mouse-y': `${mousePos.y}%`
          } as React.CSSProperties}
        />

        <div className={styles.overlayContainer}>
          <Reveal as="div" variant="section" delay={90} className={styles.textGroup}>
            <p className={styles.tagline}>UNVEILING SOON</p>
            <EditorialHeading
              as="h1"
              className={styles.headline}
              lines={["A New Standard", "of Luxury."]}
              baseDelayMs={90}
              stepDelayMs={90}
            />
          </Reveal>

          <button
            type="button"
            className={styles.ctaButton}
            onClick={() => setIsWaitlistOpen(true)}
            aria-label="Notify Me"
          >
            Notify Me
          </button>
        </div>
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </>
  );
}
