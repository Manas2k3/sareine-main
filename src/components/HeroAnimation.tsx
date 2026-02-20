"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './Hero.module.css';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';
import WaitlistModal from '@/components/WaitlistModal';

export default function HeroAnimation() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If user returned from login with notify intent
    if (user && searchParams.get('notify') === 'true') {
      setIsWaitlistOpen(true);
    }
  }, [user, searchParams]);

  const handlePointerMove = (clientX: number, clientY: number, currentTarget: EventTarget & HTMLDivElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY, e.currentTarget);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    }
  };

  const handleNotifyClick = () => {
    if (!user) {
      router.push('/signin?redirect=notify');
    } else {
      setIsWaitlistOpen(true);
    }
  };

  return (
    <>
      <div
        className={styles.canvasWrapper}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
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
            onClick={handleNotifyClick}
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
