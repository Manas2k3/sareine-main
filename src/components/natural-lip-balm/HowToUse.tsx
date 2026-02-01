import styles from './HowToUse.module.css';

const steps = [
    {
        num: "01",
        title: "Scoop",
        desc: "Take a small amount of balm, warming it between your fingertips."
    },
    {
        num: "02",
        title: "Apply",
        desc: "Gently massage onto lips in a circular motion to stimulate circulation."
    },
    {
        num: "03",
        title: "Absorb",
        desc: "Let the rich botanical oils soak in for a matte, hydrated finish."
    }
];

export default function HowToUse() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h2 className={styles.title}>Ritual of Care</h2>
                </header>

                <div className={styles.steps}>
                    {steps.map((s, i) => (
                        <div key={i} className={styles.step}>
                            {/* Divider line will be handled by CSS top-border on this or a pseudo-element */}
                            <span className={styles.stepNumber}>{s.num}</span>
                            <div className={styles.textWrapper}>
                                <h3 className={styles.stepTitle}>{s.title}</h3>
                                <p className={styles.stepDesc}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
