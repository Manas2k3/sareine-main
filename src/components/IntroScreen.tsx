"use client";

import { useState } from "react";
import Image from 'next/image';
import styles from "./IntroScreen.module.css";

interface IntroScreenProps {
    onEnter: () => void;
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    const handleEnter = () => {
        setIsFading(true);
        // Wait for the transition to finish before calling onEnter
        setTimeout(() => {
            setIsVisible(false);
            onEnter();
        }, 900);
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.introOverlay} ${isFading ? styles.hidden : ""}`}>
            <div className={styles.content}>
                <div className={styles.logoWrap}>
                    <Image
                        src="/launch-page-logo-design.png"
                        alt="Sareine"
                        width={640}
                        height={220}
                        className={styles.logo}
                        priority
                    />
                </div>

                <div className={styles.subtitle}>NOT FOR EVERYONE</div>

                <button className={styles.enterButton} onClick={handleEnter} aria-label="Enter site">
                    ENTER
                </button>
            </div>
        </div>
    );
}
