"use client";

import Image from 'next/image';
import styles from './Variants.module.css';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';

interface Product {
    id: string;
    name: string;
    price: number;
    weight: string;
    description: string;
    ingredients: string[];
    howToUse: string;
    packaging: string;
    image: string;
    slug: string;
    inStock?: boolean;
}

export default function Variants() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const q = query(collection(db, 'products'), where('category', '==', 'Lip Care'));

        // Real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];

            // Luxury lip care collection tab: only the 3 core variants (exclude Limited Edition)
            const naturalBalmOnly = productsData.filter(
                (p) => p.slug !== 'limited-edition-natural-lip-balm' && !p.name?.toLowerCase().includes('limited edition')
            );
            setProducts(naturalBalmOnly);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, []);

    return (
        <Reveal as="section" id="variants" className={styles.section} aria-label="Luxury lip care collection variants" variant="section">
            {loading ? (
                <div className={styles.container}>
                    <p className={styles.loadingMessage}>Loading collection...</p>
                </div>
            ) : (
                <div className={styles.container}>
                    <header className={styles.header}>
                        <span className={styles.subtitle}>Our Collection</span>
                        <EditorialHeading as="h2" className={styles.title} lines={["Nature's Finest", "Tints"]} />
                    </header>

                    <div>
                        {products.length === 0 ? (
                            <div className={styles.emptyMessage}>
                                <p>No products found in the collection.</p>
                            </div>
                        ) : (
                            products.map((product, index) => (
                                <Reveal
                                    key={product.id}
                                    as="div"
                                    id={`variant-${product.slug}`}
                                    className={styles.productRow}
                                    variant="lift"
                                    delay={index * 90}
                                >
                                    <Reveal as="div" className={styles.imageContainer} variant="image">
                                        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                            {(() => {
                                                // Helper to get hardcoded image based on product name
                                                const getFallbackImage = (name: string) => {
                                                    const lowerName = name.toLowerCase();
                                                    if (lowerName.includes('beetroot')) return '/sareine-natural-beetroot-lip-balm.jpeg';
                                                    if (lowerName.includes('pink')) return '/sareine-natural-pink-rose-lip-balm.jpeg';
                                                    if (lowerName.includes('rose')) return '/sareine-natural-rose-lip-balm.jpeg';
                                                    return '/sareine-natural-rose-lip-balm.jpeg'; // Default to Rose
                                                };

                                                const fallbackImage = getFallbackImage(product.name);

                                                return (
                                                    <Image
                                                        src={product.image || fallbackImage}
                                                        alt={product.name}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                        className={styles.productImage}
                                                        onError={(e) => {
                                                            console.error(`Failed to load image for ${product.name}: ${product.image}`);
                                                            const target = e.target as HTMLImageElement;
                                                            if (target.src.indexOf(fallbackImage) === -1) {
                                                                target.src = fallbackImage;
                                                                target.srcset = fallbackImage;
                                                            }
                                                        }}
                                                    />
                                                );
                                            })()}

                                            {/* Out of Stock Overlay */}
                                            {product.inStock === false && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                                    <span className="bg-[#1C1C1C] text-white px-4 py-2 text-xs uppercase tracking-widest font-medium shadow-lg">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Reveal>

                                    <div className={styles.contentContainer}>
                                        <h3 className={styles.productName}>{product.name}</h3>
                                        <div className={styles.priceRow}>
                                            <p className={styles.price}>₹{product.price} / {product.weight}</p>
                                            {product.inStock === false && (
                                                <span className="text-xs text-red-500 font-medium uppercase tracking-wide px-2 py-0.5 border border-red-200 bg-red-50">
                                                    Sold Out
                                                </span>
                                            )}
                                        </div>
                                        <p className={styles.description}>{product.description}</p>

                                        <div>
                                            <span className={styles.sectionTitle}>Key Ingredients</span>
                                            <div className={styles.ingredientsList}>
                                                {product.ingredients?.map((ing, i) => (
                                                    <span key={i} className={styles.ingredientTag}>{ing}</span>
                                                )) || <span>Natural Ingredients</span>}
                                            </div>
                                        </div>

                                        <div className={styles.detailsGrid}>
                                            <div>
                                                <h4 className={styles.detailItemTitle}>How to Use</h4>
                                                <p className={styles.detailItemText}>{product.howToUse}</p>
                                            </div>
                                            <div>
                                                <h4 className={styles.detailItemTitle}>Packaging</h4>
                                                <p className={styles.detailItemText}>{product.packaging}</p>
                                            </div>
                                        </div>

                                        <button
                                            className={`btn btn-secondary ${product.inStock === false ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-400 border-gray-200' : ''}`}
                                            style={{ alignSelf: 'start' }}
                                            onClick={() => product.inStock !== false && addToCart(product)}
                                            disabled={product.inStock === false}
                                        >
                                            {product.inStock === false ? 'Out of Stock' : 'Shop Now'}
                                        </button>
                                    </div>
                                </Reveal>
                            ))
                        )}
                    </div>
                </div>
            )}
        </Reveal>
    );
}
