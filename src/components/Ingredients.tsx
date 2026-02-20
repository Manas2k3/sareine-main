import styles from './Ingredients.module.css';
import Image from 'next/image';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';

const ingredients = [
    {
        name: 'Bulgarian Rose Oil',
        description: 'Cold-pressed from over 3,000 roses per bottle',
    },
    {
        name: 'Wild Honey Extract',
        description: 'Ethically harvested from New Zealand manuka',
    },
    {
        name: 'Jojoba & Shea',
        description: 'Triple-refined for pure, weightless nourishment',
    },
    {
        name: 'Vitamin E Complex',
        description: 'Antioxidant protection for lasting softness',
    },
];

export default function Ingredients() {
    return (
        <Reveal as="section" variant="section" className={styles.ingredients} id="ingredients" aria-labelledby="ingredients-title">
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={`${styles.inner} ${styles.blurredContent}`}>
                        <Reveal as="div" variant="image" className={styles.imageSide}>
                            <div className={`${styles.imageWrapper} ${styles.suspenseReveal}`}>
                                <Image
                                    src="/ingredients_image.png"
                                    alt="Detailed view of Sareine Lip Balm ingredients"
                                    fill
                                    className={styles.ingredientImage}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </Reveal>

                        <div className={styles.content}>
                            <span className={styles.subtitle}>The Formula</span>
                            <EditorialHeading
                                as="h2"
                                id="ingredients-title"
                                className={styles.title}
                                lines={["Nature's Finest,", "Refined"]}
                            />
                            <p className={styles.description}>
                                Every ingredient is hand-selected from the world's most pristine sources.
                                Our master formulators spent three years perfecting this blend—a symphony
                                of botanical excellence that melts effortlessly into your lips.
                            </p>

                            <ul className={styles.ingredientList} role="list">
                                {ingredients.map((ingredient, index) => (
                                    <Reveal
                                        as="li"
                                        key={index}
                                        variant="lift"
                                        delay={index * 70}
                                        className={styles.ingredientItem}
                                    >
                                        <svg className={styles.ingredientIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                            <path d="M9 12l2 2 4-4" />
                                        </svg>
                                        <span className={styles.ingredientText}>
                                            <strong className={styles.ingredientName}>{ingredient.name}</strong> — {ingredient.description}
                                        </span>
                                    </Reveal>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* The Suspension Overlay */}
                    <div className={styles.overlay}>
                        <Reveal as="h2" delay={100} variant="lift" className={styles.overlayTitle}>
                            Upcoming Limited Edition Lip Balm
                        </Reveal>
                        <Reveal as="p" delay={300} variant="lift" className={styles.overlaySubtitle}>
                            LAUNCHING SOON
                        </Reveal>
                        <Reveal as="p" delay={500} variant="lift" className={styles.overlayDesc}>
                            A rare luxury experience is arriving soon.
                        </Reveal>
                    </div>
                </div>
            </div>
        </Reveal>
    );
}
