import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        "Review the terms and conditions governing your use of the Sareine website and services.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "/terms-of-service",
    },
};

export default function TermsOfService() {
    const lastUpdated = "February 09, 2026";

    return (
        <main className="container" style={{ paddingBlock: "var(--space-16)", maxWidth: "800px" }}>
            <header style={{ marginBottom: "var(--space-10)", textAlign: "center" }}>
                <h1 style={{ marginBottom: "var(--space-2)" }}>Terms of Service</h1>
                <p style={{ fontStyle: "italic" }}>Last Updated: {lastUpdated}</p>
            </header>

            <div className="reveal is-visible" style={{ display: "grid", gap: "var(--space-8)" }}>
                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the Sareine website (sareine.in), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>2. Use License</h2>
                    <p>
                        Permission is granted to temporarily download one copy of the materials (information or software) on Sareine's website for personal, non-commercial transitory viewing only.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>3. Products and Sales</h2>
                    <p>
                        All products listed on the site are subject to availability. We reserve the right to limit the sales of our products to any person, geographic region, or jurisdiction. Prices for our products are subject to change without notice.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>4. User Accounts</h2>
                    <p>
                        When you create an account with us via Google OAuth, you must provide information that is accurate and complete. You are responsible for maintaining the confidentiality of your account and password.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>5. Disclaimer</h2>
                    <p>
                        The materials on Sareine's website are provided on an 'as is' basis. Sareine makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>6. Governing Law</h2>
                    <p>
                        These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>
                </section>

                <section style={{ padding: 0 }}>
                    <h2 style={{ fontSize: "1.8rem", marginBottom: "var(--space-3)" }}>7. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at hello@sareine.in.
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
