import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In – Sareine",
    description:
        "Sign in to your Sareine account to manage orders, track deliveries, and access exclusive member benefits.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "/signin",
    },
};

export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
