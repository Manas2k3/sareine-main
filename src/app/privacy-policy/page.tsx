import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
    const lastUpdated = "February 09, 2026";

    return (
        <main className="container" style={{ paddingBlock: "var(--space-16)", maxWidth: "800px" }}>
            <header style={{ marginBottom: "var(--space-10)", textAlign: "center" }}>
                <h1 style={{ marginBottom: "var(--space-2)" }}>Privacy Policy</h1>
                <p style={{ fontStyle: "italic" }}>Last Updated: {lastUpdated}</p>
            </header>

            <div className="reveal is-visible" style={{ display: "grid", gap: "var(--space-8)" }}>
                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>1. Introduction</h2>
                    <p>
                        Welcome to Sareine ("we," "our," or "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website, sareine.in, and use our services, including Google OAuth for authentication.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>2. Information We Collect</h2>
                    <p style={{ marginBottom: "var(--space-2)" }}>
                        We collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include:
                    </p>
                    <ul style={{ paddingLeft: "var(--space-4)", color: "var(--color-text-light)", display: "grid", gap: "var(--space-2)" }}>
                        <li>Name and email address (via Google Sign-In)</li>
                        <li>Shipping and billing addresses</li>
                        <li>Order history and preferences</li>
                    </ul>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>3. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul style={{ paddingLeft: "var(--space-4)", color: "var(--color-text-light)", display: "grid", gap: "var(--space-2)" }}>
                        <li>Process and fulfill your orders</li>
                        <li>Authenticate your account via Google OAuth</li>
                        <li>Improve our website and customer experience</li>
                        <li>Communicate with you about your orders and promotional offers (if opted-in)</li>
                    </ul>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>4. Data Protection</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information. Your data is stored securely and is only accessible to authorized personnel who need it to provide our services.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>5. Third-Party Services</h2>
                    <p>
                        We use Google OAuth for secure authentication. Google's use of information collected via their services is governed by the Google Privacy Policy. We do not sell your personal data to third parties.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>6. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal data. If you wish to exercise these rights, please contact us at hello@sareine.in.
                    </p>
                </section>

                <footer style={{ marginTop: "var(--space-10)", borderTop: "1px solid var(--color-line)", paddingTop: "var(--space-6)" }}>
                    <Link href="/" className="btn btn-secondary">
                        Return to Home
                    </Link>
                </footer>
            </div>
        </main>
    );
}
