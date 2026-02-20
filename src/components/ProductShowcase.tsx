"use client";

import styles from './ProductShowcase.module.css';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';
import PreorderModal from '@/components/PreorderModal';
import { useSiteSettings } from '@/context/SiteSettingsContext';
import ShimmerLoader from '@/components/ShimmerLoader';



// Default images for carousel
const IMAGES = [
  '/sareine-limited-edition-natural-lip-balm.png',
  '/lip-glow-balm/image-2.png',
  '/lip-glow-balm/image-3.png',
];

// Firestore Product interface matching the database schema
interface FirestoreProduct {
  id?: string;
  name: string;
  price: number;
  description: string;
  howToUse: string;
  ingredients: string[];
  packaging: string;
  weight: string;
  inStock: boolean;
  image?: string;
  slug: string;
  category: string;
  tagline?: string; // Added based on old PRODUCT
  features?: string[]; // Added based on old PRODUCT
  benefits?: string[]; // Added based on old PRODUCT
}

// Component display product interface
interface DisplayProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  tagline: string;
  short: string;
  features: string[];
  ingredients: string[];
  benefits: string[];
  howToUse: string[];
  packaging: string;
  weight: string;
  inStock: boolean;
}

export default function ProductShowcase() {
  const { preorderEnabled: IS_PREORDER } = useSiteSettings();
  const [index, setIndex] = useState(0);
  const [product, setProduct] = useState<DisplayProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [preorderOpen, setPreorderOpen] = useState(false);

  useEffect(() => {
    const productSlug = 'limited-edition-natural-lip-balm'; // Hardcoded for this specific page
    const q = query(collection(db, 'products'), where('slug', '==', productSlug));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          console.warn(`Product slug '${productSlug}' not found in Firestore. Using fallback static data.`);
          // Fallback static data if product not in DB
          setProduct({
            id: 'static-fallback-id',
            name: 'Lip Glow Balm',
            price: 1899,
            image: IMAGES[0],
            slug: productSlug,
            tagline: 'A Bloom of Luxury for Your Lips.',
            short: 'Experience the perfect harmony of nature and luxury. Our Limited Edition Lip Glow Balm is a mastercrafted blend of pristine botanical extracts, designed to deeply nourish while delivering a delicate, universally flattering tint.',
            features: [
              'Exotic Floral Infusion: Damask Rose, Himalayan Hibiscus, Night‑Blooming Jasmine, Orchid extracts',
              'Glossy, Nourishing Formula: Shea butter, cocoa butter, coconut oil',
              'Single Signature Tint: A delicate, luxurious shade',
              'Vegan & Cruelty‑Free',
              'Limited Edition Packaging with iridescent finish and gold floral accents',
            ],
            ingredients: [
              'Damask Rose Extract', 'Himalayan Hibiscus', 'Night-Blooming Jasmine', 'Orchid Extract', 'Shea Butter', 'Cocoa Butter', 'Coconut Oil', 'Vitamin E'
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
            packaging: '15g Glass Jar with Gold Lid',
            weight: '15g',
            inStock: true,
          });
          setLoading(false);
          return;
        }

        const doc = querySnapshot.docs[0];
        const firestoreData = doc.data() as FirestoreProduct;

        // Transform Firestore data to DisplayProduct format
        const displayProduct: DisplayProduct = {
          id: doc.id,
          name: firestoreData.name,
          price: firestoreData.price,
          image: firestoreData.image || IMAGES[0], // Use first default image if not specified
          slug: firestoreData.slug,
          tagline: firestoreData.tagline || 'A Bloom of Luxury for Your Lips.', // Default tagline
          short: firestoreData.description,
          features: firestoreData.features || [ // Default features
            'Exotic Floral Infusion: Damask Rose, Himalayan Hibiscus, Night‑Blooming Jasmine, Orchid extracts',
            'Glossy, Nourishing Formula: Shea butter, cocoa butter, coconut oil',
            'Single Signature Tint: A delicate, luxurious shade',
            'Vegan & Cruelty‑Free',
            'Limited Edition Packaging with iridescent finish and gold floral accents',
          ],
          ingredients: firestoreData.ingredients,
          benefits: firestoreData.benefits || [ // Default benefits
            'Deeply hydrates and softens lips',
            'Provides a soft, radiant, signature tint',
            'Leaves lips glossy, plump, and luxurious',
            'Protects against dryness and environmental stress',
            'Exclusive, limited edition',
          ],
          howToUse: firestoreData.howToUse.split('\n').filter(Boolean) || [ // Split string into array
            'Apply on clean lips for instant nourishment and radiant glow.',
            'Reapply as needed or after meals for continuous hydration.',
            'Layer under lipstick for subtle shine and luxurious finish.',
            'Treat as a daily ritual — let exotic botanicals enhance your lips’ natural beauty.',
          ],
          packaging: firestoreData.packaging,
          weight: firestoreData.weight,
          inStock: firestoreData.inStock,
        };

        setProduct(displayProduct);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching product:', err);
        setError('Failed to load product data.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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

  // Loading state
  if (loading) {
    return (
      <section className={styles.section} aria-label="Featured limited edition lip balm">
        <div className={styles.container}>
          <div style={{ padding: '4rem 1rem' }}>
            <ShimmerLoader variant="hero-section" />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <section className={styles.section} aria-label="Featured limited edition lip balm">
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <p style={{ color: 'var(--color-red, #c41e3a)' }}>{error || 'Product not available.'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <Reveal as="section" variant="section" className={styles.section} aria-label="Featured limited edition lip balm">
      <div className={styles.container}>
        {/* TEASER WRAPPER */}
        <div className={styles.teaserWrapper}>

          <Reveal
            as="div"
            variant="section"
            className={styles.heroRow}
            onTouchStart={(e) => onPointerStart(e.touches[0]?.clientX ?? 0)}
            onTouchEnd={(e) => onPointerEnd(e.changedTouches[0]?.clientX ?? 0)}
            onMouseDown={(e) => onPointerStart(e.clientX)}
            onMouseUp={(e) => onPointerEnd(e.clientX)}
          >
            {/* Left: carousel (full width on mobile, ~60% on desktop) */}
            <div className={`${styles.heroCarouselCol} ${styles.teaserBlurredImage}`}>
              <Reveal as="div" variant="image" className={`${styles.carousel} ${styles.imageCard}`}>
                {/* Use explicit width/height so Next/Image serves correctly from /public */}
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <Image
                    src={slide}
                    alt={`${product.name} image ${index + 1}`}
                    width={1200}
                    height={1200}
                    className={styles.productImage}
                    priority
                    sizes="(min-width: 1024px) 60vw, 90vw"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
              </Reveal>

              <div className={styles.dots} role="tablist" aria-label="Product slides">
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
            <div className={`${styles.content} ${styles.heroContent} ${styles.teaserBlurredContent}`}>
              <span className={styles.subtitle}>Featured</span>
              <EditorialHeading
                as="h1"
                className={styles.title}
                lines={[product.name]}
              />

              <div className={styles.priceRow}>
                <span className={styles.price} aria-hidden>₹{product.price}</span>
              </div>

              <p className={styles.tagline}>{product.tagline}</p>

              <p className={styles.desc}>{product.short}</p>

              <div className={styles.ctaWrap}>
                {/* BUTTON HIDDEN FOR TEASER 
              <button
                type="button"
                className={styles.primaryBtn}
                aria-label={IS_PREORDER ? "Pre-order limited edition" : "Add limited edition to cart"}
                onClick={() => {
                  if (IS_PREORDER) {
                    setPreorderOpen(true);
                  } else {
                    addToCart(product);
                  }
                }}
                disabled={!IS_PREORDER && !product.inStock}
                style={{
                  opacity: (IS_PREORDER || product.inStock) ? 1 : 0.6,
                  cursor: (IS_PREORDER || product.inStock) ? 'pointer' : 'not-allowed'
                }}
              >
                {IS_PREORDER ? 'Pre-order Now' : (product.inStock ? 'Add to Cart' : 'Out of Stock')}
              </button>
              */}
              </div>

              {/* Preorder Modal */}
              {/* HIDDEN IN TEASER MODE: 
            {IS_PREORDER && product && (
              <PreorderModal
                product={{ id: product.id, name: product.name, price: product.price, slug: product.slug }}
                open={preorderOpen}
                onClose={() => setPreorderOpen(false)}
              />
            )}
            */}
            </div>
          </Reveal>

          {/* TEASER OVERLAY */}
          <div className={styles.teaserOverlay}>
            <div className={styles.teaserOverlayContent}>
              <h2 className={styles.teaserOverlayTitle}>Upcoming Limited Edition Lip Balm</h2>
              <p className={styles.teaserOverlaySubtitle}>Launching Soon</p>
              <p className={styles.teaserOverlayText}>A rare luxury experience is arriving soon.</p>
            </div>
          </div>

        </div> {/* END TEASER WRAPPER */}

        {/* SECTION 2: BENEFITS */}
        <Reveal as="section" variant="section" aria-labelledby="benefits-heading" className={styles.benefitsSection}>
          <div className={styles.benefitsInner}>
            <span className={styles.eyebrow}>The Details</span>
            <EditorialHeading as="h2" id="benefits-heading" lines={["Key Benefits"]} />
            <p style={{ color: '#6b6b6b', marginBottom: '1rem' }}>Selected benefits that emphasize the product's premium performance.</p>

            <div className={styles.benefitsGrid}>
              {product.benefits.slice(0, 4).map((b: string, i: number) => (
                <Reveal key={b} as="div" variant="lift" delay={i * 75} className={styles.benefitCard}>
                  <div className={styles.benefitIcon} aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="12" cy="12" r="9" stroke="#c8b289" strokeWidth="1.25" fill="none" />
                      <path d="M8 13c1.333-1.333 3.333-1.333 4.667 0 1.333 1.333 3.333 1.333 4.667 0" stroke="#c8b289" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </div>
                  <h3 className={styles.featureTitle}>{b}</h3>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* SECTION 3: HOW TO USE */}
        <Reveal as="section" variant="section" aria-labelledby="howto-heading" className={styles.howToSection}>
          <div className={styles.howToWrap}>
            <span className={styles.eyebrow}>The Ritual</span>
            <EditorialHeading as="h2" id="howto-heading" lines={["How to Use"]} />
            <ol className={styles.howToList} aria-label="How to use steps">
              {product.howToUse.map((s: string, i: number) => (
                <Reveal key={i} as="li" variant="lift" delay={i * 70} className={styles.howToStep}>
                  <div className={styles.howToStepNumber}>{String(i + 1).padStart(2, '0')}</div>
                  <div className={styles.howToStepText}>{s}</div>
                </Reveal>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* SECTION 4: INGREDIENTS (Luxury Blend) — golden badges */}
        <Reveal as="section" variant="section" aria-labelledby="ingredients-heading" className={styles.ingredientsSection}>
          <div className={styles.ingredientsInner}>
            <span className={styles.eyebrow}>The Ingredients</span>
            <EditorialHeading as="h2" id="ingredients-heading" className={styles.ingredientsTitle} lines={["Ingredients", "(Luxury Blend)"]} />
            <p className={styles.ingredientsSubtitle}>Carefully selected natural ingredients that nourish and protect.</p>

            <div className={styles.ingredientsGrid} role="list">
              {product.ingredients.map((ing: string, i: number) => (
                <Reveal key={ing} as="span" variant="lift" delay={i * 45} className={styles.ingredientBadge} role="listitem">{ing}</Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Reveal>
  );
}
