import styles from './Contact.module.css';

export default function Contact() {
    const currentYear = new Date().getFullYear();

    return (
        <section className={styles.contact} id="contact" aria-labelledby="contact-title">
            <div className="container">
                <div className={styles.inner}>
                    <span className={styles.subtitle}>Join the Waitlist</span>
                    <h2 id="contact-title" className={styles.title}>
                        Be Among the First
                    </h2>
                    <p className={styles.description}>
                        Only 2,000 pieces available worldwide. Secure your Limited Edition
                        Natural Lip Balm before they're gone forever.
                    </p>

                    <div className={styles.actions}>
                        <a href="#" className="btn btn-primary" role="button">
                            Pre-order Now — ₹2,999
                        </a>
                    </div>

                    <div className={styles.divider}>
                        <div className={styles.dividerLine}></div>
                        <span className={styles.dividerText}>Or</span>
                        <div className={styles.dividerLine}></div>
                    </div>

                    <a href="mailto:hello@sareine.com" className={styles.emailLink}>
                        <svg className={styles.emailIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                        hello@sareine.com
                    </a>

                    <footer className={styles.footer}>
                        <p className={styles.footerText}>
                            © {currentYear} <span className={styles.footerBrand}>Sareine</span>. All rights reserved.
                        </p>
                    </footer>
                </div>
            </div>
        </section>
    );
}
