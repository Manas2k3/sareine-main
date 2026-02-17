import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gifts & Giveaways | Exclusive Beauty Rewards – Sareine",
    description:
        "Unlock exclusive gifts, limited-edition beauty rewards, and lucky draws when you shop with Sareine. Discover curated giveaways for our valued customers.",
    keywords:
        "exclusive beauty rewards, Sareine giveaways, luxury beauty gifts, limited edition rewards, beauty lucky draw",
    alternates: {
        canonical: "/gifts",
    },
    openGraph: {
        title: "Gifts & Giveaways | Exclusive Beauty Rewards – Sareine",
        description:
            "Shop with Sareine and unlock exclusive gifts, lucky draws, and limited-edition beauty rewards curated just for you.",
        url: "/gifts",
        type: "website",
        images: [
            {
                url: "/dyson-giveaway.jpg",
                width: 1200,
                height: 630,
                alt: "Sareine Exclusive Giveaway – Win a Dyson",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Gifts & Giveaways | Exclusive Beauty Rewards – Sareine",
        description:
            "Unlock exclusive gifts and limited-edition beauty rewards when you shop with Sareine.",
        images: ["/dyson-giveaway.jpg"],
    },
};

export default function GiftsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
