"use client";

import { GIFTS } from "@/lib/gifts";
import Image from "next/image";
import Link from "next/link";
import styles from "./gifts.module.css";

export default function GiftsPage() {
    return (
        <main className={styles.page}>
            <div className={styles.container}>
                {/* Page Header */}
                <header className={styles.header}>
                    <p className={styles.eyebrow}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden
                        >
                            <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.193c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 12.75v9h6a2.25 2.25 0 0 0 2.25-2.25v-6.75h-8.25Z" />
                        </svg>
                        Gifts &amp; Giveaways
                    </p>
                    <h1 className={styles.pageTitle}>Exclusive Rewards</h1>
                    <p className={styles.pageSubtitle}>
                        Shop with Sareine and unlock exclusive gifts, lucky draws, and
                        limited-edition rewards curated just for you.
                    </p>
                </header>

                {/* Gifts Grid */}
                <section className={styles.giftsGrid} aria-label="Available gifts">
                    {GIFTS.map((gift) => (
                        <article key={gift.id} className={styles.giftCard}>
                            <div className={styles.badge}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {gift.badgeText}
                            </div>
                            <div className={styles.imageWrap}>
                                <Image
                                    src={gift.image}
                                    alt={gift.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 480px"
                                    className={styles.image}
                                    priority
                                />
                            </div>
                            <div className={styles.content}>
                                <h2 className={styles.giftTitle}>{gift.title}</h2>
                                <p className={styles.giftTagline}>{gift.tagline}</p>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Start Shopping CTA */}
                <div className={styles.ctaWrap}>
                    <Link href="/" className={styles.ctaBtn}>
                        Start Shopping
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 12h14M13 5l6 7-6 7"
                            />
                        </svg>
                    </Link>
                </div>
            </div>
        </main>
    );
}

