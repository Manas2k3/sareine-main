"use client";

import { useState, FormEvent } from "react";
import styles from "./AddressForm.module.css";

export interface ShippingAddress {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip: string;
}

interface AddressFormProps {
    onSubmit: (address: ShippingAddress) => void;
    onBack: () => void;
    isProcessing: boolean;
    defaultEmail?: string;
    defaultName?: string;
}

export default function AddressForm({
    onSubmit,
    onBack,
    isProcessing,
    defaultEmail,
    defaultName,
}: AddressFormProps) {
    const [address, setAddress] = useState<ShippingAddress>({
        name: defaultName ?? "",
        email: defaultEmail ?? "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
    });

    const handleChange = (field: keyof ShippingAddress, value: string) => {
        setAddress((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(address);
    };

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit}
            autoComplete="on"
            aria-label="Shipping address"
        >
            <header className={styles.formHeader}>
                <button
                    type="button"
                    onClick={onBack}
                    className={styles.backBtn}
                    aria-label="Back to cart"
                    disabled={isProcessing}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        width={20}
                        height={20}
                        aria-hidden
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 12H5M12 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <h3 className={styles.formTitle}>Shipping Details</h3>
            </header>

            <div className={styles.fieldGrid}>
                <div className={styles.fieldFull}>
                    <label htmlFor="addr-name" className={styles.label}>
                        Full Name
                    </label>
                    <input
                        id="addr-name"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="Your full name"
                        value={address.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>

                <div className={styles.fieldHalf}>
                    <label htmlFor="addr-email" className={styles.label}>
                        Email
                    </label>
                    <input
                        id="addr-email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="your@email.com"
                        value={address.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>

                <div className={styles.fieldHalf}>
                    <label htmlFor="addr-phone" className={styles.label}>
                        Phone
                    </label>
                    <input
                        id="addr-phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        placeholder="10-digit number"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        value={address.phone}
                        onChange={(e) =>
                            handleChange("phone", e.target.value.replace(/\D/g, ""))
                        }
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>

                <div className={styles.fieldFull}>
                    <label htmlFor="addr-street" className={styles.label}>
                        Street Address
                    </label>
                    <input
                        id="addr-street"
                        type="text"
                        required
                        autoComplete="street-address"
                        placeholder="House/flat, building, street"
                        value={address.street}
                        onChange={(e) => handleChange("street", e.target.value)}
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>

                <div className={styles.fieldHalf}>
                    <label htmlFor="addr-city" className={styles.label}>
                        City
                    </label>
                    <input
                        id="addr-city"
                        type="text"
                        required
                        autoComplete="address-level2"
                        placeholder="City"
                        value={address.city}
                        onChange={(e) => handleChange("city", e.target.value)}
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>

                <div className={styles.fieldHalf}>
                    <label htmlFor="addr-state" className={styles.label}>
                        State
                    </label>
                    <input
                        id="addr-state"
                        type="text"
                        required
                        autoComplete="address-level1"
                        placeholder="State"
                        value={address.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>

                <div className={styles.fieldFull}>
                    <label htmlFor="addr-zip" className={styles.label}>
                        PIN Code
                    </label>
                    <input
                        id="addr-zip"
                        type="text"
                        required
                        autoComplete="postal-code"
                        placeholder="6-digit PIN"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={address.zip}
                        onChange={(e) =>
                            handleChange("zip", e.target.value.replace(/\D/g, ""))
                        }
                        className={styles.input}
                        disabled={isProcessing}
                    />
                </div>
            </div>

            <button
                type="submit"
                className={styles.submitBtn}
                disabled={isProcessing}
            >
                {isProcessing ? (
                    <>
                        Processing…
                        <span className={styles.spinner} aria-hidden />
                    </>
                ) : (
                    <>
                        Proceed
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            width={18}
                            height={18}
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                            />
                        </svg>
                    </>
                )}
            </button>
        </form>
    );
}
