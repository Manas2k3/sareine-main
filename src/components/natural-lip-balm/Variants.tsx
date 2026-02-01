"use client";

import Image from 'next/image';
import styles from './Variants.module.css';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';

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

            // Optional: Sort by price or name if needed
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
        });

        // Cleanup on unmount
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <section className={styles.section}>
                <div className={styles.container}>
                    <p className="text-center text-[#8C8C8C]">Loading collection...</p>
                </div>
            </section>
        );
    }

    return (
        <section id="variants" className={styles.section} aria-label="Natural balm variants">
            <div className={styles.container}>
                <header className={styles.header}>
                    <span className={styles.subtitle}>Our Collection</span>
                    <h2 className={styles.title}>Nature's Finest Tints</h2>
                </header>

                <div>
                    {products.length === 0 ? (
                        <div className="text-center text-[#8C8C8C] py-20">
                            <p>No products found in the collection.</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className={styles.productRow}>
                                <div className={styles.imageContainer}>
                                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                            className={styles.productImage}
                                        />
                                        {/* Out of Stock Overlay */}
                                        {product.inStock === false && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-[1px]">
                                                <span className="bg-[#1C1C1C] text-white px-4 py-2 text-xs uppercase tracking-widest font-medium shadow-lg">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.contentContainer}>
                                    <h3 className={styles.productName}>{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-2">
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
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
