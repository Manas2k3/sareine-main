"use client";

import { createPortal } from 'react-dom';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import SearchBar from './SearchBar';
import styles from './Navbar.module.css';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouteTransition } from '@/components/motion/RouteTransitionProvider';
import { useSiteSettings } from '@/context/SiteSettingsContext';



export default function Navbar() {
    const { preorderEnabled: IS_PREORDER } = useSiteSettings();
    const [scrolled, setScrolled] = useState(false);
    const { toggleCart, cartCount } = useCart();
    const { user, signOut } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileNav, setShowMobileNav] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showHomeDropdown, setShowHomeDropdown] = useState(false);
    const [showNaturalDropdown, setShowNaturalDropdown] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { navigate } = useRouteTransition();
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
                navigate(href);
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
            navigate(href);

            // Wait for the new content to render, then scroll to hash if present
            requestAnimationFrame(() => {
                const el = document.getElementById(hash as string);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        } catch (err) {
            // If URL parsing fails, fall back to transition navigation
            console.error('Anchor navigation error', err);
            navigate(href);
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
            navigate('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            {/* Mobile menu button - LEFT SIDE */}
            <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="md:hidden p-2 text-[#1C1C1C] order-1"
                aria-label="Toggle navigation"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Brand - CENTER-LEFT */}
            <Link href="/" className={`${styles.brand} order-2`}>
                <Image src="/logo-image.png" alt="Sareine Logo" width={40} height={40} className={styles.logo} />
                SAREINE
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex order-3 flex-1 max-w-[400px] mx-4">
                <SearchBar />
            </div>

            {/* Desktop Navigation Links */}
            <div className={`${styles.navLinks} hidden md:flex order-4`}>
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
                    <Link href="/natural-balm">Luxury lip care collection</Link>

                    {/* Luxury lip care collection dropdown: show the three Sareine product images */}
                    {showNaturalDropdown && (
                        <div className={styles.dropdown} onMouseEnter={() => setShowNaturalDropdown(true)} onMouseLeave={() => setShowNaturalDropdown(false)}>
                            <div className={styles.dropdownGrid}>
                                <Link href="/natural-balm#variants" className={styles.dropdownItem} onClick={(e) => handleAnchorClick(e, '/natural-balm#variants')}>
                                    <Image src="/sareine-natural-rose-lip-balm.jpeg" alt="Rose Balm" width={240} height={240} className={styles.dropdownImage} />
                                </Link>
                                <Link href="/natural-balm#variants" className={styles.dropdownItem} onClick={(e) => handleAnchorClick(e, '/natural-balm#variants')}>
                                    <Image src="/sareine-natural-beetroot-lip-balm.jpeg" alt="Beetroot Balm" width={240} height={240} className={styles.dropdownImage} />
                                </Link>
                                <Link href="/natural-balm#variants" className={styles.dropdownItem} onClick={(e) => handleAnchorClick(e, '/natural-balm#variants')}>
                                    <Image src="/sareine-natural-pink-rose-lip-balm.jpeg" alt="Pink Rose Balm" width={240} height={240} className={styles.dropdownImage} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <Link href="/gifts" className={styles.navLink}>Gifts</Link>

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

            {/* Mobile nav overlay — rendered via portal to escape transformed parent */}
            {showMobileNav && typeof document !== 'undefined' && createPortal(
                <>
                    {/* Backdrop overlay */}
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden"
                        style={{ zIndex: 1499 }}
                        onClick={() => setShowMobileNav(false)}
                    />

                    {/* Menu panel */}
                    <div className={styles.mobileMenu}>
                        <div className={styles.mobileMenuHeader}>
                            <span className={styles.mobileMenuLabel}>Navigation</span>
                            <button
                                type="button"
                                className={styles.mobileMenuClose}
                                onClick={() => setShowMobileNav(false)}
                                aria-label="Close navigation"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className={styles.mobileMenuContent}>
                            <div className={styles.mobileMenuSection}>
                                <p className={styles.mobileMenuSectionTitle}>Explore</p>
                                <Link
                                    href="/"
                                    className={styles.mobileMenuItem}
                                    onClick={() => setShowMobileNav(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/natural-balm"
                                    className={styles.mobileMenuItem}
                                    onClick={() => setShowMobileNav(false)}
                                >
                                    Luxury lip care collection
                                </Link>
                                <Link
                                    href="/gifts"
                                    className={styles.mobileMenuItem}
                                    onClick={() => setShowMobileNav(false)}
                                >
                                    Gifts
                                </Link>
                            </div>
                            <div className={styles.mobileMenuSection}>
                                <p className={styles.mobileMenuSectionTitle}>On This Page</p>
                                {isNaturalBalm ? (
                                    <>
                                        <Link
                                            href="/natural-balm#formula"
                                            className={styles.mobileMenuItem}
                                            onClick={(e) => {
                                                handleAnchorClick(e, '/natural-balm#formula');
                                                setShowMobileNav(false);
                                            }}
                                        >
                                            The Formula
                                        </Link>
                                        <Link
                                            href="/natural-balm#features"
                                            className={styles.mobileMenuItem}
                                            onClick={(e) => {
                                                handleAnchorClick(e, '/natural-balm#features');
                                                setShowMobileNav(false);
                                            }}
                                        >
                                            Features
                                        </Link>
                                        <Link
                                            href="/natural-balm#variants"
                                            className={styles.mobileMenuItem}
                                            onClick={(e) => {
                                                handleAnchorClick(e, '/natural-balm#variants');
                                                setShowMobileNav(false);
                                            }}
                                        >
                                            Our Collections
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/#features"
                                            className={styles.mobileMenuItem}
                                            onClick={(e) => {
                                                handleAnchorClick(e, '/#features');
                                                setShowMobileNav(false);
                                            }}
                                        >
                                            Features
                                        </Link>
                                        <Link
                                            href="/#ingredients"
                                            className={styles.mobileMenuItem}
                                            onClick={(e) => {
                                                handleAnchorClick(e, '/#ingredients');
                                                setShowMobileNav(false);
                                            }}
                                        >
                                            Ingredients
                                        </Link>
                                        <Link
                                            href="/#contact"
                                            className={styles.mobileMenuItem}
                                            onClick={(e) => {
                                                handleAnchorClick(e, '/#contact');
                                                setShowMobileNav(false);
                                            }}
                                        >
                                            Contact
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}


            <div className={`${styles.actions} order-5`}>
                {/* Mobile Search Icon */}
                <button
                    onClick={() => setShowMobileSearch(true)}
                    className="md:hidden text-[#1C1C1C] hover:text-[#D4AF37] transition-colors p-2"
                    aria-label="Search products"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.bagIcon}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>

                {/* Auth Section */}
                <div className={styles.profileArea} ref={menuRef}>
                    {user ? (
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className={styles.profileTrigger}
                            aria-haspopup="menu"
                            aria-expanded={showProfileMenu}
                        >
                            <span className="sr-only">Open user menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.bagIcon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        </button>
                    ) : (
                        <Link href="/signin" className={styles.loginLink}>
                            Login
                        </Link>
                    )}

                    {/* Profile Dropdown */}
                    {user && showProfileMenu && (
                        <div className={styles.profileMenu} role="menu" aria-label="User menu">
                            <div className={styles.profileMenuHeader}>
                                <p className={styles.profileMenuLabel}>Signed in as</p>
                                <p className={styles.profileMenuName}>{user.displayName || user.email}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className={styles.profileMenuAction}
                                role="menuitem"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.profileMenuActionIcon}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                                Sign out
                            </button>
                        </div>
                    )}
                </div>

                {!IS_PREORDER && (
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
                )}

                <a href="#contact" className={`${styles.preOrderBtn} hidden md:inline-flex`} onClick={(e) => handleAnchorClick(e, '/#contact')}>
                    Pre-Order
                </a>
            </div>

            {/* Mobile Search Overlay */}
            {showMobileSearch && (
                <SearchBar isMobile onClose={() => setShowMobileSearch(false)} />
            )}
        </nav>
    );
}
