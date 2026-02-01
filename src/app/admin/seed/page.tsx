"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

const INITIAL_PRODUCTS = [
    {
        name: "Sareine Natural Rose Lip Balm",
        price: 599,
        weight: "5 g",
        description: "Pamper your lips with the natural goodness of Sareine Rose Lip Balm. Infused with nourishing natural ingredients and delicate rose extract, it keeps your lips soft, smooth, and hydrated all day. Lightweight, non-sticky, and perfect for everyday use, this lip balm protects your lips while leaving a subtle, refreshing rose fragrance.",
        ingredients: [
            "Beeswax", "Shea Butter", "Coconut Oil", "Rose Extract", "Vitamin E", "Natural Oils"
        ],
        howToUse: "Apply a small amount to clean lips as needed. Reapply throughout the day to maintain smooth and hydrated lips.",
        packaging: "Acrylic glass jar (5g), perfect for on-the-go use.",
        image: "/Sareine Natural Rose Lip Balm.jpeg",
        slug: "natural-rose-lip-balm",
        category: "Lip Care",
        inStock: true
    },
    {
        name: "Sareine Natural Beetroot Lip Balm",
        price: 599,
        weight: "5 g",
        description: "Bring a natural flush to your lips with Sareine Beetroot Lip Balm. Enriched with nourishing ingredients and pure beetroot extract, it hydrates, softens, and protects your lips while giving them a subtle, natural tint. Lightweight and non-sticky, this balm is perfect for everyday use.",
        ingredients: [
            "Beeswax", "Shea Butter", "Coconut Oil", "Beetroot Extract", "Vitamin E", "Natural Oils"
        ],
        howToUse: "Apply a small amount to clean lips as needed. Reapply throughout the day for soft, naturally tinted lips.",
        packaging: "Acrylic glass jar (5g), perfect for on-the-go use.",
        image: "/Sareine Natural Beetroot Lip Balm.jpeg",
        slug: "natural-beetroot-lip-balm",
        category: "Lip Care",
        inStock: true
    },
    {
        name: "Sareine Natural Pink Rose Lip Balm",
        price: 599,
        weight: "5 g",
        description: "Indulge your lips in the gentle elegance of Sareine Pink Rose Lip Balm. Infused with natural ingredients and pure pink rose petals extract, it nourishes, hydrates, and protects your lips while leaving a soft, romantic pink tint. Keeps your lips soft, smooth, and naturally radiant.",
        ingredients: [
            "Beeswax", "Shea Butter", "Coconut Oil", "Pink Rose Petals Extract", "Vitamin E", "Natural Oils"
        ],
        howToUse: "Apply a small amount to clean lips as needed. Reapply throughout the day to maintain soft, naturally tinted, and healthy lips.",
        packaging: "Acrylic glass jar (5g), portable & perfect for on-the-go use.",
        image: "/Sareine Natural Pink Rose Lip Balm.jpeg",
        slug: "natural-pink-rose-lip-balm",
        category: "Lip Care",
        inStock: true
    },
    {
        name: "Sareine Limited Edition Natural Lip Balm",
        price: 2999,
        weight: "15 g",
        description: "Only 2,000 pieces available worldwide. Secure your Limited Edition Natural Lip Balm before they're gone forever. Experience the absolute pinnacle of botanical luxury with this exclusive collector's edition.",
        ingredients: [
            "Premium Beeswax", "Rare Shea Butter", "Cold-Pressed Coconut Oil", "Exclusive Rose Extract", "Vitamin E", "Gold Flakes"
        ],
        howToUse: "Use sparingly for an ultra-luxurious treatment. Perfect for overnight repair.",
        packaging: "Hand-crafted Collector's Jar (15g), Numbered Edition.",
        image: "/ingredients_image.png",
        slug: "limited-edition-natural-lip-balm",
        category: "Limited Edition",
        inStock: true
    }
];

export default function SeedPage() {
    const [status, setStatus] = useState<string>('');

    const seedProducts = async () => {
        try {
            setStatus('Seeding...');
            const productsRef = collection(db, 'products');

            for (const product of INITIAL_PRODUCTS) {
                // Check if exists
                const q = query(productsRef, where('slug', '==', product.slug));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    // Update existing
                    const docId = snapshot.docs[0].id;
                    await setDoc(doc(db, 'products', docId), product, { merge: true });
                    setStatus(prev => prev + `\nUpdated ${product.name}`);
                } else {
                    // Create new
                    await addDoc(productsRef, product);
                    setStatus(prev => prev + `\nAdded ${product.name}`);
                }
            }
            setStatus(prev => prev + '\nDone!');
        } catch (error) {
            console.error(error);
            setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] pt-32 px-8 flex justify-center">
            <div className="max-w-2xl w-full">
                <div className="bg-white border border-[#E5E5E5] p-8 shadow-sm rounded-none">
                    <h1 className="text-3xl font-serif text-[#1C1C1C] mb-2">Database Seeder</h1>
                    <p className="text-[#666] mb-8 font-light text-sm">
                        Use this utility to populate your Firestore database with the initial product collection.
                        This will check for existing products to avoid duplicates.
                    </p>

                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={seedProducts}
                            disabled={status.startsWith('Seeding')}
                            className="bg-[#1C1C1C] text-white px-6 py-3 uppercase tracking-widest text-xs font-medium hover:bg-[#D4AF37] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status.startsWith('Seeding') ? 'Seeding...' : 'Seed Products'}
                        </button>
                    </div>

                    {status && (
                        <div className="bg-[#F9F9F9] border border-[#EEEEEE] p-4 text-xs text-[#444] font-mono whitespace-pre-wrap h-64 overflow-y-auto">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
