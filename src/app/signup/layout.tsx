import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create Account – Sareine",
    description:
        "Create your Sareine account to unlock exclusive drops, track purchases, and join the luxury lip care community.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "/signup",
    },
};

export default function SignUpLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
