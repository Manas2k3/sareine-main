import styles from './Ingredients.module.css';
import Image from 'next/image';

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
        <section className={styles.ingredients} id="ingredients" aria-labelledby="ingredients-title">
            <div className="container">
                <div className={styles.inner}>
                    <div className={styles.imageSide}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src="/ingredients_image.png"
                                alt="Detailed view of Sareine Lip Balm ingredients"
                                fill
                                className={styles.ingredientImage}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    <div className={styles.content}>
                        <span className={styles.subtitle}>The Formula</span>
                        <h2 id="ingredients-title" className={styles.title}>
                            Nature's Finest, Refined
                        </h2>
                        <p className={styles.description}>
                            Every ingredient is hand-selected from the world's most pristine sources.
                            Our master formulators spent three years perfecting this blend—a symphony
                            of botanical excellence that melts effortlessly into your lips.
                        </p>

                        <ul className={styles.ingredientList} role="list">
                            {ingredients.map((ingredient, index) => (
                                <li key={index} className={styles.ingredientItem}>
                                    <svg className={styles.ingredientIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                    <span className={styles.ingredientText}>
                                        <strong className={styles.ingredientName}>{ingredient.name}</strong> — {ingredient.description}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
