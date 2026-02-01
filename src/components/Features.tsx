import styles from './Features.module.css';

const features = [
    {
        title: 'Exotic Floral Infusion',
        description: 'A delicate blend of rare rose damascena, jasmine sambac, and white lily extracts from the world\'s most pristine gardens.',
        icon: (
            <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2C12 2 14.5 5.5 14.5 8.5C14.5 11.5 12 14 12 14C12 14 9.5 11.5 9.5 8.5C9.5 5.5 12 2 12 2Z" />
                <path d="M12 14C12 14 16 11 19 11C22 11 22 14 22 14C22 17 19 20 12 22C5 20 2 17 2 14C2 14 2 11 5 11C8 11 12 14 12 14Z" />
            </svg>
        ),
    },
    {
        title: 'Vegan & Cruelty-Free',
        description: 'Crafted with unwavering ethical commitment. No animal testing, no animal-derived ingredients—ever.',
        icon: (
            <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        ),
    },
    {
        title: 'Limited Edition',
        description: 'Only 2,000 pieces worldwide. Each comes with a numbered certificate of authenticity in bespoke packaging.',
        icon: (
            <svg className={styles.iconSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
    },
];

export default function Features() {
    return (
        <section className={styles.features} id="features" aria-labelledby="features-title">
            <div className="container">
                <header className={styles.header}>
                    <span className={styles.subtitle}>The Details</span>
                    <h2 id="features-title" className={styles.title}>
                        Crafted for Perfection
                    </h2>
                </header>

                <div className={styles.grid} role="list">
                    {features.map((feature, index) => (
                        <article key={index} className={styles.feature} role="listitem">
                            <div className={styles.icon} aria-hidden="true">
                                {feature.icon}
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
