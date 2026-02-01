import styles from './KeyBenefits.module.css';

const benefits = [
    {
        title: "Deep Hydration",
        desc: "Penetrates 3 layers deep for 24-hour moisture retention.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
        )
    },
    {
        title: "Barrier Repair",
        desc: "Fortifies the skin's natural barrier against environmental stressors.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        )
    },
    {
        title: "Soft Focus Finish",
        desc: "Instantly smoothes texture for a velvet-soft appearance.",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
            </svg>
        )
    }
];

export default function KeyBenefits() {
    return (
        <section id="features" className={styles.section}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <span className={styles.subtitle}>Why You'll Love It</span>
                    <h2 className={styles.title}>Visible Results</h2>
                </header>

                <div className={styles.grid}>
                    {benefits.map((b, i) => (
                        <div key={i} className={styles.card}>
                            <div className={styles.icon}>{b.icon}</div>
                            <h3 className={styles.cardTitle}>{b.title}</h3>
                            <p className={styles.cardDesc}>{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
