import styles from './FinalCTA.module.css';
import Reveal from '@/components/motion/Reveal';
import EditorialHeading from '@/components/motion/EditorialHeading';

export default function FinalCTA() {
    return (
        <Reveal as="section" id="buy-now" className={styles.section} variant="section">
            <div className={styles.container}>
                <EditorialHeading as="h2" className={styles.title} lines={["Sareine", "Natural Lip Balm"]} />
                <p className={styles.subtitle}>
                    Experience the difference of pure botanical luxury.
                    Limited stock available.
                </p>
                <a href="#variants" className={styles.buyBtn}>
                    Shop the collection — from ₹599
                </a>
            </div>
        </Reveal>
    );
}
