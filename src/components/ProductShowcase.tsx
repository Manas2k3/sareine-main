"use client";

import styles from './ProductShowcase.module.css';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';

// Single Limited Edition product data (unchanged copy)
const IMAGES = [
  '/lip-glow-balm/image-1.png',
  '/lip-glow-balm/image-2.png',
  '/lip-glow-balm/image-3.png',
];

const PRODUCT = {
  id: 'sareine-limited-edition',
  name: 'Sareine Limited Edition Natural Lip Balm',
  price: 2999,
  image: '/lip-glow-balm/image-1.png',
  slug: 'limited-edition-natural-lip-balm',
  tagline: '“A Bloom of Luxury for Your Lips.”',
  short:
    'Introducing the Sareine Limited Edition Lip Balm, the pinnacle of luxury lip care. Inspired by the world’s most exotic flowers, this exclusive edition delivers rich nourishment, glossy radiance, and a soft, luminous tint that enhances your natural lips. Every swipe is an experience of elegance and indulgence — truly one of a kind.',
  features: [
    'Exotic Floral Infusion: Damask Rose, Himalayan Hibiscus, Night‑Blooming Jasmine, Orchid extracts',
    'Glossy, Nourishing Formula: Shea butter, cocoa butter, coconut oil',
    'Single Signature Tint: A delicate, luxurious shade',
    'Vegan & Cruelty‑Free',
    'Limited Edition Packaging with iridescent finish and gold floral accents',
  ],
  ingredients: [
    'Shea Butter',
    'Cocoa Butter',
    'Coconut Oil',
    'Candelilla Wax',
    'Jojoba Oil',
    'Sweet Almond Oil',
    'Vitamin E',
    'Damask Rose Extract',
    'Himalayan Hibiscus Extract',
    'Night‑Blooming Jasmine Extract',
    'Orchid Extract',
  ],
  benefits: [
    'Deeply hydrates and softens lips',
    'Provides a soft, radiant, signature tint',
    'Leaves lips glossy, plump, and luxurious',
    'Protects against dryness and environmental stress',
    'Exclusive, limited edition',
  ],
  howToUse: [
    'Apply on clean lips for instant nourishment and radiant glow.',
    'Reapply as needed or after meals for continuous hydration.',
    'Layer under lipstick for subtle shine and luxurious finish.',
    'Treat as a daily ritual — let exotic botanicals enhance your lips’ natural beauty.',
  ],
  signatureTint:
    'A single, luxurious shade designed to complement all skin tones — soft, luminous, and elegant.',
};

export default function ProductShowcase() {
  const [index, setIndex] = useState(0);
  const { addToCart } = useCart();

  const prev = () => setIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setIndex((i) => (i + 1) % IMAGES.length);

  // Support both touch and mouse (pointer) swipes
  const pointerStartX = useRef<number | null>(null);

  const onPointerStart = (clientX: number) => {
    pointerStartX.current = clientX;
  };

  const onPointerEnd = (clientX: number) => {
    if (pointerStartX.current == null) return;
    const dx = clientX - pointerStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    pointerStartX.current = null;
  };

  const slide = IMAGES[index];

  return (
    <section className={styles.section} aria-label="Featured limited edition lip balm">
      <div className={styles.container}>
        {/* SECTION 1: HERO (two-column responsive) */}
        <div
          className={styles.heroRow}
          style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
          onTouchStart={(e) => onPointerStart(e.touches[0]?.clientX ?? 0)}
          onTouchEnd={(e) => onPointerEnd(e.changedTouches[0]?.clientX ?? 0)}
          onMouseDown={(e) => onPointerStart(e.clientX)}
          onMouseUp={(e) => onPointerEnd(e.clientX)}
        >
          {/* Left: carousel (full width on mobile, ~60% on desktop) */}
          <div className={styles.heroCarouselCol}>
              <div className={`${styles.carousel} ${styles.imageCard}`}>
                {/* Use explicit width/height so Next/Image serves correctly from /public */}
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <Image
                    src={slide}
                    alt={`${PRODUCT.name} image ${index + 1}`}
                    width={1200}
                    height={1200}
                    className={styles.productImage}
                    priority
                    sizes="(min-width: 1024px) 60vw, 90vw"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
              </div>

            <div className={styles.dots} role="tablist" aria-label="Product slides" style={{ marginTop: 16 }}>
              {IMAGES.map((src, i) => (
                <button
                  key={src}
                  className={`${styles.dot} ${i === index ? styles.dotActive : ''}`.trim()}
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-selected={i === index}
                />
              ))}
            </div>
          </div>

          {/* Right: product content (full width on mobile, ~40% on desktop) */}
          <div className={`${styles.content} ${styles.heroContent}`}>
            <span className={styles.subtitle}>Featured</span>
            <h1 className={styles.title} style={{ marginTop: 8, marginBottom: 8 }}>{PRODUCT.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price} aria-hidden style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{PRODUCT.price}</span>
            </div>

            <p className={styles.tagline}>{PRODUCT.tagline}</p>

            <p className={styles.desc} style={{ marginBottom: 18 }}>{PRODUCT.short}</p>

            <div className={styles.ctaWrap}>
              <button
                type="button"
                className={styles.primaryBtn}
                aria-label="Add limited edition to cart"
                onClick={() => addToCart(PRODUCT)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: BENEFITS */}
        <section aria-labelledby="benefits-heading" className={styles.benefitsSection}>
          <div className={styles.benefitsInner}>
            <span className={styles.eyebrow}>The Details</span>
            <h2 id="benefits-heading" style={{ marginBottom: '0.75rem' }}>Key Benefits</h2>
            <p style={{ color: '#6b6b6b', marginBottom: '1rem' }}>Selected benefits that emphasize the product’s premium performance.</p>

            <div className={styles.benefitsGrid}>
              {PRODUCT.benefits.slice(0, 4).map((b, i) => (
                <div key={b} className={styles.benefitCard}>
                  <div className={styles.benefitIcon} aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="12" cy="12" r="9" stroke="#c8b289" strokeWidth="1.25" fill="none" />
                      <path d="M8 13c1.333-1.333 3.333-1.333 4.667 0 1.333 1.333 3.333 1.333 4.667 0" stroke="#c8b289" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                  <h3 className={styles.featureTitle}>{b}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW TO USE */}
        <section aria-labelledby="howto-heading" className={styles.howToSection}>
          <div className={styles.howToWrap}>
            <span className={styles.eyebrow}>The Ritual</span>
            <h2 id="howto-heading" style={{ marginBottom: '0.5rem', textAlign: 'center' }}>How to Use</h2>
            <ol className={styles.howToList} aria-label="How to use steps">
              {PRODUCT.howToUse.map((s, i) => (
                <li key={i} className={styles.howToStep}>
                  <div className={styles.howToStepNumber}>{String(i + 1).padStart(2, '0')}</div>
                  <div className={styles.howToStepText}>{s}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SECTION 4: INGREDIENTS (Luxury Blend) — golden badges */}
        <section aria-labelledby="ingredients-heading" className={styles.ingredientsSection}>
          <div className={styles.ingredientsInner}>
            <span className={styles.eyebrow}>The Ingredients</span>
            <h2 id="ingredients-heading" className={styles.ingredientsTitle}>Ingredients (Luxury Blend)</h2>
            <p className={styles.ingredientsSubtitle}>Carefully selected natural ingredients that nourish and protect.</p>

            <div className={styles.ingredientsGrid} role="list">
              {PRODUCT.ingredients.map((ing) => (
                <span key={ing} className={styles.ingredientBadge} role="listitem">{ing}</span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
