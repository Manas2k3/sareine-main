import styles from './FinalCTA.module.css';

export default function FinalCTA() {
    return (
        <section id="buy-now" className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.title}>Sareine Natural Lip Balm</h2>
                <p className={styles.subtitle}>
                    Experience the difference of pure botanical luxury.
                    Limited stock available.
                </p>
                <a href="#variants" className={styles.buyBtn}>
                    Shop the collection — from ₹599
                </a>
            </div>
        </section>
    );
}
