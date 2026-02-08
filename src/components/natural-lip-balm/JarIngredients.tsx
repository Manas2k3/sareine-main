import styles from './JarIngredients.module.css';
import Image from 'next/image';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';

const ingredients = [
    {
        name: "Manuka Honey",
        desc: "A natural humectant that draws moisture into the skin for deep, lasting hydration.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        )
    },
    {
        name: "Rose Damascena",
        desc: "Rare oil extract known for its calming properties and exquisite, subtle fragrance.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
            </svg>
        )
    },
    {
        name: "Shea Butter",
        desc: "Rich in fatty acids to nourish and protect the delicate skin barrier.",
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.2 7.8l-7.7 7.7-4-4L20.2 7.8zM2 12l10 10 10-10L12 2 2 12z" />
            </svg>
        )
    }
];

export default function JarIngredients() {
    return (
        <Reveal as="section" id="formula" className={styles.section} variant="section">
            <div className={styles.container}>
                <Reveal as="div" className={styles.imageColumn} variant="image">
                    {/* Main Formula Shot */}
                    <Image
                        src="/jar-portrait.png"
                        alt="Sareine Natural Lip Balm Formula"
                        fill
                        className={styles.ingredientImage} // Correct class name
                        sizes="(max-width: 768px) 100vw, 600px"
                    />
                </Reveal>

                <div className={styles.textColumn}>
                    <span className={styles.subtitle}>The Formula</span>
                    <EditorialHeading as="h2" className={styles.title} lines={["Botanical", "Excellence"]} />

                    <div className={styles.gridContainer}>
                        {/* Group 1: Botanical Extracts */}
                        <div className={styles.group}>
                            <span className={styles.groupLabel}>Botanical Extracts</span>
                            <div className={styles.groupGrid}>
                                {ingredients.slice(0, 2).map((item, i) => (
                                    <Reveal key={i} as="div" className={styles.item} variant="lift" delay={i * 75}>
                                        <div className={styles.iconWrapper}>
                                            {item.icon}
                                        </div>
                                        <div className={styles.itemContent}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <p className={styles.itemDesc}>{item.desc}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>

                        {/* Visual Divider / Spacer if needed, or just handled by grid gap */}

                        {/* Group 2: Base Ingredients */}
                        <div className={styles.group}>
                            <span className={styles.groupLabel}>Base Formula</span>
                            <div className={styles.groupGrid}>
                                {ingredients.slice(2).map((item, i) => (
                                    <Reveal key={i} as="div" className={styles.item} variant="lift" delay={(i + 2) * 75}>
                                        <div className={styles.iconWrapper}>
                                            {item.icon}
                                        </div>
                                        <div className={styles.itemContent}>
                                            <span className={styles.itemName}>{item.name}</span>
                                            <p className={styles.itemDesc}>{item.desc}</p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}
