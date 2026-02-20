"use client";

import styles from './ShimmerLoader.module.css';

interface ShimmerLoaderProps {
    variant?: 'box' | 'text' | 'title' | 'button' | 'hero-section' | 'product-card' | 'spinner';
    className?: string;
    style?: React.CSSProperties;
    lines?: number; // Used for text variant to render multiple lines
}

export default function ShimmerLoader({ variant = 'box', className = '', style = {}, lines = 1 }: ShimmerLoaderProps) {

    // Simple spinner variant for buttons
    if (variant === 'spinner') {
        return <span className={`${styles.spinner} ${className}`} style={style} aria-label="Loading..." />;
    }

    // Complex Pre-composed Variants

    // 1. Hero Section Skeleton (Image left, text right)
    if (variant === 'hero-section') {
        return (
            <div className={`${styles.heroSection} ${className}`} style={style} aria-hidden="true" data-testid="shimmer-hero">
                <div className={`${styles.shimmer} ${styles.heroImage}`} />
                <div className={styles.heroContent}>
                    <div className={`${styles.shimmer} ${styles.shimmerTextLine}`} style={{ width: '30%', marginBottom: '1rem' }} />
                    <div className={`${styles.shimmer} ${styles.shimmerTitle}`} />
                    <div className={`${styles.shimmer} ${styles.shimmerTextLine}`} style={{ width: '40%', marginBottom: '2rem' }} />

                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={`${styles.shimmer} ${styles.shimmerTextLine}`} />
                    ))}

                    <div className={`${styles.shimmer} ${styles.shimmerButton}`} style={{ marginTop: '2rem' }} />
                </div>
            </div>
        );
    }

    // 2. Product Card Skeleton (Image top, text bottom)
    if (variant === 'product-card') {
        return (
            <div className={`${styles.productCard} ${className}`} style={style} aria-hidden="true" data-testid="shimmer-card">
                <div className={`${styles.shimmer} ${styles.cardImage}`} />
                <div className={styles.cardContent}>
                    <div className={`${styles.shimmer} ${styles.shimmerTitle}`} style={{ height: '1.75rem', width: '80%', marginBottom: '0.5rem' }} />
                    <div className={`${styles.shimmer} ${styles.shimmerTextLine}`} style={{ width: '50%' }} />

                    <div style={{ marginTop: '1rem' }}>
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className={`${styles.shimmer} ${styles.shimmerTextLine}`} style={{ width: '100%' }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Generic Layout Variants

    if (variant === 'text') {
        return (
            <div className={className} style={{ width: '100%', ...style }} aria-hidden="true">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`${styles.shimmer} ${styles.shimmerTextLine}`}
                        style={{ width: i === lines - 1 && lines > 1 ? '70%' : '100%' }} // Last line shorter for realistic look
                    />
                ))}
            </div>
        );
    }

    // Base specific elements
    let baseClass = styles.shimmerBox;
    if (variant === 'title') baseClass = styles.shimmerTitle;
    if (variant === 'button') baseClass = styles.shimmerButton;

    return (
        <div className={`${styles.shimmer} ${baseClass} ${className}`} style={style} aria-hidden="true" />
    );
}
