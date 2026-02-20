"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import styles from './WaitlistModal.module.css';
import { motion, AnimatePresence } from 'framer-motion';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const { user } = useAuth();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const performSubmit = async (submitEmail: string, submitName: string) => {
        setLoading(true);
        setError('');
        try {
            await addDoc(collection(db, 'waitlist'), {
                email: submitEmail,
                name: submitName || 'Anonymous',
                source: user ? 'hero_frosted_teaser_auto' : 'hero_frosted_teaser',
                createdAt: serverTimestamp()
            });

            setSuccess(true);
        } catch (err: any) {
            console.error('Error adding to waitlist:', err);
            setError('Something went wrong. Please try again later.');
            setLoading(false);
        }
    };

    // Auto-submit if user is already logged in
    useEffect(() => {
        if (isOpen && user && !success && !loading && !error) {
            performSubmit(user.email || '', user.displayName || '');
        }
    }, [isOpen, user, success, loading, error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        await performSubmit(email, name);
    };

    const handleClose = () => {
        // Reset state when closing so it's fresh for next open
        setTimeout(() => {
            setEmail('');
            setName('');
            setSuccess(false);
            setError('');
        }, 300); // Wait for exit animation
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay} onClick={handleClose}>
                    <motion.div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <button className={styles.closeButton} onClick={handleClose} aria-label="Close modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className={styles.modalContent}>
                            {success ? (
                                <div className={styles.successContent}>
                                    <div className={styles.successIcon}>
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                    </div>
                                    <h2 className={styles.title}>You're on the list.</h2>
                                    <p className={styles.description}>
                                        Thank you for your interest. You will be among the first to know when our new standard of luxury is unveiled.
                                    </p>
                                </div>
                            ) : user ? (
                                <div className={styles.successContent}>
                                    <h2 className={styles.title}>Securing your spot...</h2>
                                    <p className={styles.description}>
                                        Please wait a moment.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className={styles.title}>Unlock the Secret</h2>
                                    <p className={styles.description}>
                                        Join our exclusive waitlist to be notified the moment our latest luxury creation is revealed.
                                    </p>

                                    <form onSubmit={handleSubmit} className={styles.form}>
                                        <div className={styles.inputGroup}>
                                            <label htmlFor="waitlist-name" className={styles.label}>Name (Optional)</label>
                                            <input
                                                type="text"
                                                id="waitlist-name"
                                                className={styles.input}
                                                placeholder="Enter your name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>

                                        <div className={styles.inputGroup}>
                                            <label htmlFor="waitlist-email" className={styles.label}>Email Address *</label>
                                            <input
                                                type="email"
                                                id="waitlist-email"
                                                className={styles.input}
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            {error && <span className={styles.errorText}>{error}</span>}
                                        </div>

                                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                                            {loading ? 'Subscribing...' : 'Notify Me'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
