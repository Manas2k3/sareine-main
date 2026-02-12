"use client";

import Image from 'next/image';
import styles from './JarHero.module.css';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  slug: string;
  inStock?: boolean;
}

export default function JarHero() {
  const [allOutOfStock, setAllOutOfStock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'), where('category', '==', 'Lip Care'));

    // Real-time listener to monitor stock status
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      // Filter out Limited Edition (same logic as Variants.tsx)
      const naturalBalmOnly = productsData.filter(
        (p) => p.slug !== 'limited-edition-natural-lip-balm' && !p.name?.toLowerCase().includes('limited edition')
      );

      // Check if ALL products are out of stock
      const allAreOutOfStock = naturalBalmOnly.length > 0 && naturalBalmOnly.every(product => product.inStock === false);

      setAllOutOfStock(allAreOutOfStock);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching product stock status:", error);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  return (
    <section id="jar-hero-wrapper" className={styles.heroWrapper}>
      <div className={styles.stickyContainer}>
        <div className={styles.canvasWrapper}>
          <Reveal as="div" variant="image" className={styles.heroImageReveal}>
            <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
              <Image
                src="/hero-images/hero-image2.png"
                alt="Sareine Luxury lip care collection"
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

              <a
                href={allOutOfStock ? undefined : "#buy-now"}
                className={`${styles.ctaButton} ${allOutOfStock ? styles.outOfStock : ''}`}
                style={allOutOfStock ? { cursor: 'not-allowed', opacity: 0.6 } : {}}
                onClick={allOutOfStock ? (e) => e.preventDefault() : undefined}
              >
                {loading ? 'Loading...' : (allOutOfStock ? 'Out of Stock' : 'Add to Cart')}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
