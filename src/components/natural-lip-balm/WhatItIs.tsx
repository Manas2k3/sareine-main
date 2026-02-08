import styles from './WhatItIs.module.css';
import Image from 'next/image';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';

export default function WhatItIs() {
    return (
        <Reveal as="section" variant="section" className={styles.section}>
            <div className={styles.container}>
                <span className={styles.subtitle}>The Essential</span>
                <EditorialHeading as="h2" className={styles.title} lines={["Nature's", "Purest Touch"]} />
                <p className={styles.description}>
                    A meticulously crafted balm that marries the healing power of raw manuka honey
                    with the delicate essence of Bulgarian rose. Designed to deeply hydrate, repair,
                    and protect your lips with a weightless, non-sticky finish.
                </p>

                <Reveal as="div" variant="image" className={styles.imageWrapper}>
                    <Image
                        src="/product-lifestyle-shot-jar.jpeg"
                        alt="Sareine Natural Lip Balm Lifestyle"
                        fill
                        className={styles.productImage}
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                </Reveal>
            </div>
        </Reveal>
    );
}
