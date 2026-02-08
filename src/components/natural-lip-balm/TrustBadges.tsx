import styles from './TrustBadges.module.css';
import Reveal from '@/components/motion/Reveal';

const badges = [
    {
        label: "Vegan",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M8 11h8" />
                <path d="M12 7v8" />
            </svg>
        )
    },
    {
        label: "Cruelty Free",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        )
    },
    {
        label: "Plant Based",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
        )
    },
    {
        label: "Sustainably Sourced",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        )
    }
];

export default function TrustBadges() {
    return (
        <Reveal as="section" className={styles.section} variant="section">
            <div className={styles.container}>
                <div className={styles.badges}>
                    {badges.map((b, i) => (
                        <Reveal key={i} as="div" className={styles.badge} variant="lift" delay={i * 70}>
                            <div className={styles.icon}>{b.icon}</div>
                            <span className={styles.label}>{b.label}</span>
                        </Reveal>
                    ))}
                </div>
            </div>
        </Reveal>
    );
}
