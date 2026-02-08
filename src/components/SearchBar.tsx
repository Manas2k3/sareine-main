"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import Image from 'next/image';
import styles from './SearchBar.module.css';
import { useRouteTransition } from '@/components/motion/RouteTransitionProvider';

interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    slug?: string;
    category?: string;
}

interface SearchBarProps {
    isMobile?: boolean;
    onClose?: () => void;
}

export default function SearchBar({ isMobile = false, onClose }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { navigate } = useRouteTransition();

    const splitSearchTerms = (term: string) =>
        term
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(Boolean);

    // Debounced search function against Firestore `products.name`.
    const searchProducts = useCallback(async (term: string) => {
        const normalizedTerm = term.trim();
        if (!normalizedTerm) {
            setResults([]);
            setShowDropdown(false);
            setSelectedIndex(-1);
            return;
        }

        setIsLoading(true);
        try {
            const productsRef = collection(db, 'products');
            const searchWords = splitSearchTerms(normalizedTerm);

            const snapshot = await getDocs(
                query(
                    productsRef,
                    orderBy('name')
                )
            );

            const matches = snapshot.docs
                .map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() } as Product))
                .filter((product) => {
                    const productName = product.name?.toLowerCase() ?? '';
                    return searchWords.every((word) => productName.includes(word));
                })
                .sort((a, b) => {
                    const aName = a.name.toLowerCase();
                    const bName = b.name.toLowerCase();
                    const full = normalizedTerm.toLowerCase();

                    const aScore = aName.startsWith(full) ? 3 : aName.includes(full) ? 2 : 1;
                    const bScore = bName.startsWith(full) ? 3 : bName.includes(full) ? 2 : 1;
                    return bScore - aScore || aName.localeCompare(bName);
                });

            setResults(matches);
            setShowDropdown(true);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
            setShowDropdown(false);
            setSelectedIndex(-1);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getProductDestination = (product: Product) => {
        if (product.slug === 'limited-edition-natural-lip-balm') {
            return '/';
        }

        if (product.slug) {
            return `/natural-balm#variant-${product.slug}`;
        }

        if (product.category === 'Lip Care') {
            return '/natural-balm#variants';
        }

        return '/natural-balm#variants';
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(searchTerm);
        }, 250);

        return () => clearTimeout(timer);
    }, [searchTerm, searchProducts]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showDropdown || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < results.length) {
                    handleProductClick(results[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowDropdown(false);
                setSelectedIndex(-1);
                break;
        }
    };

    // Navigate to product page
    const handleProductClick = (product: Product) => {
        navigate(getProductDestination(product));
        setSearchTerm('');
        setShowDropdown(false);
        setSelectedIndex(-1);

        if (isMobile && onClose) {
            onClose();
        }
    };

    // Focus input when mobile overlay opens
    useEffect(() => {
        if (isMobile && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isMobile]);

    return (
        <div className={`${styles.searchContainer} ${isMobile ? styles.mobileSearch : ''}`} ref={searchRef}>
            <div className={styles.searchInputWrapper}>
                <svg
                    className={styles.searchIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchTerm && setShowDropdown(true)}
                    className={styles.searchInput}
                    aria-label="Search products"
                    aria-autocomplete="list"
                    aria-controls="search-results"
                />
                {searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setResults([]);
                            setShowDropdown(false);
                            setSelectedIndex(-1);
                        }}
                        className={styles.clearButton}
                        aria-label="Clear search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {showDropdown && (
                <div className={styles.dropdown} id="search-results" role="listbox">
                    {isLoading ? (
                        <div className={styles.loadingState}>
                            <div className={styles.spinner}></div>
                            <p>Searching...</p>
                        </div>
                    ) : results.length > 0 ? (
                        results.map((product, index) => (
                            <button
                                key={product.id}
                                onClick={() => handleProductClick(product)}
                                className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                                role="option"
                                aria-selected={index === selectedIndex}
                            >
                                <div className={styles.productImage}>
                                    <Image
                                        src={product.image || '/logo.jpg'}
                                        alt={product.name}
                                        width={48}
                                        height={48}
                                        className={styles.image}
                                    />
                                </div>
                                <div className={styles.productInfo}>
                                    <p className={styles.productName}>{product.name}</p>
                                    <p className={styles.productPrice}>₹{product.price}</p>
                                </div>
                            </button>
                        ))
                    ) : searchTerm ? (
                        <div className={styles.noResults}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <p>No products found</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
