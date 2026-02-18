"use client";

import Image from 'next/image';
import styles from './JarHero.module.css';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import PreorderModal from '@/components/PreorderModal';

const IS_PREORDER = process.env.NEXT_PUBLIC_ENABLE_PREORDER === "true";

interface Product {
  id: string;
  name: string;
  slug: string;
  price?: number;
  inStock?: boolean;
}

export default function JarHero() {
  const [allOutOfStock, setAllOutOfStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preorderOpen, setPreorderOpen] = useState(false);
  const [firstProduct, setFirstProduct] = useState<Product | null>(null);

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
      if (naturalBalmOnly.length > 0) setFirstProduct(naturalBalmOnly[0]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching product stock status:", error);
      setLoading(false);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  const handleCtaClick = (e: React.MouseEvent) => {
    if (IS_PREORDER) {
      e.preventDefault();
      setPreorderOpen(true);
      return;
    }
    if (allOutOfStock) {
      e.preventDefault();
      return;
    }
    // If not preorder, default anchor behavior (#buy-now) applies
  };

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
                href={IS_PREORDER ? undefined : (allOutOfStock ? undefined : "#buy-now")}
                className={`${styles.ctaButton} ${!IS_PREORDER && allOutOfStock ? styles.outOfStock : ''}`}
                style={!IS_PREORDER && allOutOfStock ? { cursor: 'not-allowed', opacity: 0.6 } : { cursor: 'pointer' }}
                onClick={handleCtaClick}
              >
                {loading ? 'Loading...' : (IS_PREORDER ? 'Pre-order Now' : (allOutOfStock ? 'Out of Stock' : 'Add to Cart'))}
              </a>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Preorder Modal */}
      {IS_PREORDER && firstProduct && (
        <PreorderModal
          product={{ id: firstProduct.id, name: firstProduct.name, price: firstProduct.price || 599, slug: firstProduct.slug }}
          open={preorderOpen}
          onClose={() => setPreorderOpen(false)}
        />
      )}
    </section>
  );
}
