"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./PreorderModal.module.css";

const IS_PREORDER = process.env.NEXT_PUBLIC_ENABLE_PREORDER === "true";

interface PreorderProduct {
    id: string;
    name: string;
    price: number;
    slug: string;
    weight?: string;
}

interface PreorderModalProps {
    product: PreorderProduct;
    open: boolean;
    onClose: () => void;
}

export default function PreorderModal({ product, open, onClose }: PreorderModalProps) {
    const { user } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Pre-fill from user auth
    useEffect(() => {
        if (user) {
            setForm((f) => ({
                ...f,
                name: user.displayName || f.name,
                email: user.email || f.email,
            }));
        }
    }, [user]);

    // Reset on close
    useEffect(() => {
        if (!open) {
            setSuccess(false);
            setError("");
        }
    }, [open]);

    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!IS_PREORDER || !open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        // Basic validation
        if (!form.name || !form.email || !form.phone || !form.street || !form.city || !form.state || !form.zip) {
            setError("Please fill in all fields.");
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch("/api/preorder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.uid || "guest",
                    items: [
                        {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            slug: product.slug,
                        },
                    ],
                    amount: product.price,
                    currency: "INR",
                    shippingAddress: {
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        street: form.street,
                        city: form.city,
                        state: form.state,
                        zip: form.zip,
                    },
                    customerName: form.name,
                    customerEmail: form.email,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Something went wrong");
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to place preorder");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Pre-order form">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Close */}
                <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>

                {success ? (
                    /* ─── Success state ─── */
                    <div className={styles.successWrap}>
                        <div className={styles.successIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a45c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h3 className={styles.successTitle}>Pre-order Placed!</h3>
                        <p className={styles.successText}>
                            Thank you for your interest in <strong>{product.name}</strong>. We'll send you a payment link once your order is confirmed.
                        </p>
                        <button type="button" className={styles.doneBtn} onClick={onClose}>
                            Done
                        </button>
                    </div>
                ) : (
                    /* ─── Form ─── */
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>Pre-order</h2>
                            <div className={styles.productInfo}>
                                <span className={styles.productName}>{product.name}</span>
                                <span className={styles.productPrice}>₹{product.price}</span>
                            </div>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.row}>
                                <label className={styles.field}>
                                    <span className={styles.label}>Full Name</span>
                                    <input name="name" value={form.name} onChange={handleChange} className={styles.input} placeholder="Your name" required />
                                </label>
                                <label className={styles.field}>
                                    <span className={styles.label}>Email</span>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} className={styles.input} placeholder="you@email.com" required />
                                </label>
                            </div>

                            <label className={styles.field}>
                                <span className={styles.label}>Phone</span>
                                <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={styles.input} placeholder="+91 XXXXX XXXXX" required />
                            </label>

                            <label className={styles.field}>
                                <span className={styles.label}>Street Address</span>
                                <input name="street" value={form.street} onChange={handleChange} className={styles.input} placeholder="House/Flat No, Street" required />
                            </label>

                            <div className={styles.row}>
                                <label className={styles.field}>
                                    <span className={styles.label}>City</span>
                                    <input name="city" value={form.city} onChange={handleChange} className={styles.input} placeholder="City" required />
                                </label>
                                <label className={styles.field}>
                                    <span className={styles.label}>State</span>
                                    <input name="state" value={form.state} onChange={handleChange} className={styles.input} placeholder="State" required />
                                </label>
                                <label className={styles.field}>
                                    <span className={styles.label}>PIN Code</span>
                                    <input name="zip" value={form.zip} onChange={handleChange} className={styles.input} placeholder="PIN" required />
                                </label>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={submitting}>
                                {submitting ? "Placing Pre-order…" : "Confirm Pre-order"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
