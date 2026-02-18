import type { Metadata } from "next";
import JarHero from "@/components/natural-lip-balm/JarHero";
import WhatItIs from "@/components/natural-lip-balm/WhatItIs";
import JarIngredients from "@/components/natural-lip-balm/JarIngredients";
import KeyBenefits from "@/components/natural-lip-balm/KeyBenefits";
import TrustBadges from "@/components/natural-lip-balm/TrustBadges";
import FinalCTA from "@/components/natural-lip-balm/FinalCTA";
import Variants from "@/components/natural-lip-balm/Variants";
import JsonLd from "@/components/JsonLd";
import { adminDb } from "@/lib/firebase/admin";

/* ──────────────────────────────────────────────
 * Product Page Metadata
 * Target keywords: limited edition, natural lip treatment,
 * exotic botanicals, luxury lip balm.
 * ────────────────────────────────────────────── */
export const metadata: Metadata = {
    title: "Natural Lip Balm – Exotic Botanicals Lip Treatment",
    description:
        "Sareine Natural Lip Balm — a luxury lip treatment infused with exotic botanicals. Hydrate, nourish, and protect your lips with nature's finest ingredients.",
    keywords: [
        "natural lip balm",
        "luxury lip balm",
        "exotic botanicals lip treatment",
        "luxury lip care",
        "vegan lip balm",
        "cruelty-free lip treatment",
        "Sareine natural balm",
    ],
    alternates: {
        canonical: "/natural-balm",
    },
    openGraph: {
        title: "Natural Lip Balm – Exotic Botanicals | Sareine",
        description:
            "A luxury lip treatment infused with exotic botanicals. Hydrate and nourish your lips with nature's finest ingredients.",
        url: "/natural-balm",
        type: "website",
        images: [
            {
                url: "/sareine-natural-rose-lip-balm.jpeg",
                width: 1200,
                height: 630,
                alt: "Sareine Natural Rose Lip Balm",
            },
            {
                url: "/sareine-natural-beetroot-lip-balm.jpeg",
                width: 1200,
                height: 630,
                alt: "Sareine Natural Beetroot Lip Balm",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Natural Lip Balm | Sareine",
        description:
            "Infused with exotic botanicals for effortlessly soft, nourished lips.",
        images: ["/sareine-natural-rose-lip-balm.jpeg"],
    },
};

/* ──────────────────────────────────────────────
 * Fetch product data from Firestore (server-side only).
 * Reads the "Lip Care" category to build accurate JSON-LD
 * with real prices and stock status.
 * ────────────────────────────────────────────── */
interface FirestoreProduct {
    name: string;
    price: number;
    inStock?: boolean;
    image?: string;
    description?: string;
}

async function getProductData(): Promise<FirestoreProduct[]> {
    try {
        const snapshot = await adminDb
            .collection("products")
            .where("category", "==", "Lip Care")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                name: data.name ?? "Sareine Natural Lip Balm",
                price: data.price ?? 0,
                inStock: data.inStock !== false,
                image: data.image,
                description: data.description,
            };
        });
    } catch (error) {
        console.error("[SEO] Failed to fetch product data from Firestore:", error);
        return [];
    }
}

function buildProductSchema(products: FirestoreProduct[]) {
    const inStockProducts = products.filter((p) => p.inStock !== false);
    const allPrices = products.map((p) => p.price).filter((p) => p > 0);
    const hasStock = inStockProducts.length > 0;

    const lowPrice = allPrices.length > 0 ? Math.min(...allPrices) : 199;
    const highPrice = allPrices.length > 0 ? Math.max(...allPrices) : 199;

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Sareine Natural Lip Balm",
        image: [
            "https://sareine.in/sareine-natural-rose-lip-balm.jpeg",
            "https://sareine.in/sareine-natural-beetroot-lip-balm.jpeg",
            "https://sareine.in/sareine-natural-pink-rose-lip-balm.jpeg",
        ],
        description:
            "A luxury natural lip balm crafted with exotic botanicals. Hydrate, nourish, and protect your lips with nature's finest ingredients.",
        brand: {
            "@type": "Brand",
            name: "Sareine",
        },
        offers:
            allPrices.length > 1
                ? {
                    "@type": "AggregateOffer",
                    url: "https://sareine.in/natural-balm",
                    priceCurrency: "INR",
                    lowPrice: String(lowPrice),
                    highPrice: String(highPrice),
                    offerCount: String(allPrices.length),
                    availability: hasStock
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                }
                : {
                    "@type": "Offer",
                    url: "https://sareine.in/natural-balm",
                    priceCurrency: "INR",
                    price: String(lowPrice),
                    availability: hasStock
                        ? "https://schema.org/InStock"
                        : "https://schema.org/OutOfStock",
                    seller: {
                        "@type": "Organization",
                        name: "Sareine",
                    },
                },
    };
}

export default async function NaturalBalmPage() {
    const products = await getProductData();
    const productSchema = buildProductSchema(products);

    return (
        // Luxury lip care collection needs a slightly larger anchor offset because the hero is sticky
        // and we want linked sections to clear the navbar and hero correctly.
        <main style={{ '--section-scroll-offset': '120px' } as React.CSSProperties}>
            <JsonLd data={productSchema} />
            <JarHero />
            <WhatItIs />
            <JarIngredients />
            <KeyBenefits />
            <Variants />
            <TrustBadges />
            <FinalCTA />
        </main>
    );
}

