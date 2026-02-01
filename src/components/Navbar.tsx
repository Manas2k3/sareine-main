"use client";

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { toggleCart, cartCount } = useCart();
    const { user, signOut } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [showHomeDropdown, setShowHomeDropdown] = useState(false);
    const [showNaturalDropdown, setShowNaturalDropdown] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const isNaturalBalm = pathname?.startsWith('/natural-balm');

    // Smooth-scroll to anchors. If the target is on the same page, prevent the
    // default navigation and perform a smooth scroll. If the target is on a
    // different page, navigate then smooth-scroll after navigation completes.
    const handleAnchorClick = async (e: React.MouseEvent, href: string) => {
        // Allow modifier keys to behave normally (open in new tab etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();
        try {
            const url = new URL(href, window.location.origin);
            const targetPath = url.pathname || '/';
            const hash = url.hash ? url.hash.substring(1) : null;

            if (!hash) {
                // No hash, just navigate normally
                await router.push(href);
                return;
            }

            // If the target path is the current path, just scroll to the element
            if (targetPath === pathname) {
                const el = document.getElementById(hash);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // fallback: still update the hash
                    window.location.hash = hash;
                }
                return;
            }

            // Navigate to the target path (with hash), then smooth scroll when done
            await router.push(href);

            // Wait for the new content to render, then scroll to hash if present
            requestAnimationFrame(() => {
                const el = document.getElementById(hash as string);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        } catch (err) {
            // If URL parsing fails, fall back to router navigation
            console.error('Anchor navigation error', err);
            router.push(href);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await signOut();
            setShowProfileMenu(false);
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <Link href="/" className={styles.brand}>
                <Image src="/logo-image.png" alt="Sareine Logo" width={40} height={40} className={styles.logo} />
                SAREINE
            </Link>

            <div className={`${styles.navLinks} hidden md:flex`}>
                <div
                    className={styles.navLink}
                    onMouseEnter={() => setShowHomeDropdown(true)}
                    onMouseLeave={() => setShowHomeDropdown(false)}
                >
                    <Link href="/">Home</Link>

                    {/* Home dropdown: first tab shows lip-glow-balm images */}
                    {showHomeDropdown && (
                        <div className={styles.dropdown} onMouseEnter={() => setShowHomeDropdown(true)} onMouseLeave={() => setShowHomeDropdown(false)}>
                            <div className={styles.dropdownGrid}>
                                <Link href="/" className={styles.dropdownItem}>
                                    <Image src="/lip-glow-balm/image-1.png" alt="Lip Glow 1" width={240} height={320} className={styles.dropdownImage} />
                                </Link>
                                <Link href="/" className={styles.dropdownItem}>
                                    <Image src="/lip-glow-balm/image-2.png" alt="Lip Glow 2" width={240} height={320} className={styles.dropdownImage} />
                                </Link>
                                <Link href="/" className={styles.dropdownItem}>
                                    <Image src="/lip-glow-balm/image-3.png" alt="Lip Glow 3" width={240} height={320} className={styles.dropdownImage} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    className={styles.navLink}
                    onMouseEnter={() => setShowNaturalDropdown(true)}
                    onMouseLeave={() => setShowNaturalDropdown(false)}
                >
                    <Link href="/natural-balm">Natural Balm</Link>

                    {/* Natural Balm dropdown: show the three Sareine product images */}
                    {showNaturalDropdown && (
                        <div className={styles.dropdown} onMouseEnter={() => setShowNaturalDropdown(true)} onMouseLeave={() => setShowNaturalDropdown(false)}>
                            <div className={styles.dropdownGrid}>
                                <Link href="/natural-balm#variants" className={styles.dropdownItem} onClick={(e) => handleAnchorClick(e, '/natural-balm#variants')}>
                                    <Image src="/Sareine Natural Rose Lip Balm.jpeg" alt="Rose Balm" width={240} height={240} className={styles.dropdownImage} />
                                </Link>
                                <Link href="/natural-balm#variants" className={styles.dropdownItem} onClick={(e) => handleAnchorClick(e, '/natural-balm#variants')}>
                                    <Image src="/Sareine Natural Beetroot Lip Balm.jpeg" alt="Beetroot Balm" width={240} height={240} className={styles.dropdownImage} />
                                </Link>
                                <Link href="/natural-balm#variants" className={styles.dropdownItem} onClick={(e) => handleAnchorClick(e, '/natural-balm#variants')}>
                                    <Image src="/Sareine Natural Pink Rose Lip Balm.jpeg" alt="Pink Rose Balm" width={240} height={240} className={styles.dropdownImage} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop links vary depending on the current page */}
                {isNaturalBalm ? (
                    <>
                        <Link href="/natural-balm#formula" className={styles.navLink} onClick={(e) => handleAnchorClick(e, '/natural-balm#formula')}>
                            The Formula
                        </Link>
                        <Link href="/natural-balm#features" className={styles.navLink} onClick={(e) => handleAnchorClick(e, '/natural-balm#features')}>
                            Features
                        </Link>
                        <Link href="/natural-balm#variants" className={styles.navLink} onClick={(e) => handleAnchorClick(e, '/natural-balm#variants')}>
                            our collections
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/#features" className={styles.navLink} onClick={(e) => handleAnchorClick(e, '/#features')}>
                            Features
                        </Link>
                        <Link href="/#ingredients" className={styles.navLink} onClick={(e) => handleAnchorClick(e, '/#ingredients')}>
                            Ingredients
                        </Link>
                        <Link href="/#contact" className={styles.navLink} onClick={(e) => handleAnchorClick(e, '/#contact')}>
                            Contact
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile menu button */}
            <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="md:hidden p-2 text-[#1C1C1C]"
                aria-label="Toggle navigation"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile nav overlay */}
            {showMobileNav && (
                <div className="absolute top-full left-0 w-full bg-white border-t border-[#E5E5E5] z-40 shadow-md md:hidden">
                    <div className="flex flex-col p-4 gap-3">
                        <Link href="/" className="text-[#1C1C1C] font-medium">Home</Link>
                        <Link href="/natural-balm" className="text-[#1C1C1C] font-medium">Natural Balm</Link>
                        {isNaturalBalm ? (
                            <>
                                <Link href="/natural-balm#formula" className="text-[#1C1C1C] font-medium" onClick={(e) => handleAnchorClick(e, '/natural-balm#formula')}>The Formula</Link>
                                <Link href="/natural-balm#features" className="text-[#1C1C1C] font-medium" onClick={(e) => handleAnchorClick(e, '/natural-balm#features')}>Features</Link>
                                <Link href="/natural-balm#variants" className="text-[#1C1C1C] font-medium" onClick={(e) => handleAnchorClick(e, '/natural-balm#variants')}>our collections</Link>
                            </>
                        ) : (
                            <>
                                <Link href="/#features" className="text-[#1C1C1C] font-medium" onClick={(e) => handleAnchorClick(e, '/#features')}>Features</Link>
                                <Link href="/#ingredients" className="text-[#1C1C1C] font-medium" onClick={(e) => handleAnchorClick(e, '/#ingredients')}>Ingredients</Link>
                                <Link href="/#contact" className="text-[#1C1C1C] font-medium" onClick={(e) => handleAnchorClick(e, '/#contact')}>Contact</Link>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className={styles.actions}>
                {/* Auth Section */}
                <div className="relative" ref={menuRef}>
                    {user ? (
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="text-[#1C1C1C] hover:text-[#D4AF37] transition-colors p-2 flex items-center"
                        >
                            <span className="sr-only">Open user menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.bagIcon || "w-6 h-6"}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </button>
                    ) : (
                        <Link href="/signin" className="text-[#1C1C1C] hover:text-[#D4AF37] transition-colors p-2 font-medium text-sm">
                            Login
                        </Link>
                    )}

                    {/* Profile Dropdown */}
                    {user && showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E5E5] shadow-xl rounded-md overflow-hidden z-50 animate-fade-in origin-top-right">
                            <div className="px-4 py-3 border-b border-[#E5E5E5] bg-[#FAF9F6]">
                                <p className="text-xs text-[#8C8C8C] uppercase tracking-wider">Signed in as</p>
                                <p className="text-sm font-medium truncate text-[#1C1C1C]">{user.displayName || user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 text-sm text-[#1C1C1C] hover:bg-[#F9F5F1] hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                                Sign out
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={toggleCart}
                    className="relative text-[#1C1C1C] hover:text-[#D4AF37] transition-colors p-2"
                >
                    <span className="sr-only">Open cart</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.bagIcon}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#D4AF37] rounded-full">
                            {cartCount}
                        </span>
                    )}
                </button>

                <a href="#contact" className={styles.preOrderBtn} onClick={(e) => handleAnchorClick(e, '/#contact')}>
                    Pre-Order
                </a>
            </div>
        </nav>
    );
}
