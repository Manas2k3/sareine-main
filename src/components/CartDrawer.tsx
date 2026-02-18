"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { GIFTS } from "@/lib/gifts";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./CartDrawer.module.css";
import AddressForm, { type ShippingAddress } from "./AddressForm";

/* ─── Razorpay typings ─── */
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (res: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance {
  open: () => void;
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/* ─── Preorder mode ─── */
const IS_PREORDER = process.env.NEXT_PUBLIC_ENABLE_PREORDER === "true";

/* ─── Checkout steps ─── */
type CheckoutStep = "cart" | "address" | "success";

/* ─── Load Razorpay script once ─── */
function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(s);
  });
}

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  const { user } = useAuth();
  const cartRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<CheckoutStep>("cart");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ─── Close on outside click ─── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) {
        toggleCart();
      }
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartOpen, toggleCart]);

  /* ─── Reset state when drawer closes ─── */
  useEffect(() => {
    if (!isCartOpen) {
      setStep("cart");
      setErrorMsg(null);
      setIsProcessing(false);
    }
  }, [isCartOpen]);

  /* ─── Step 1: Checkout → address ─── */
  const handleCheckoutClick = useCallback(() => {
    if (!user) {
      alert("Please sign in to proceed with checkout.");
      return;
    }
    if (cart.length === 0) return;
    setErrorMsg(null);
    setStep("address");
  }, [user, cart]);

  /* ─── Step 2a: Address submitted → PREORDER (no payment) ─── */
  const handlePreorderSubmit = useCallback(
    async (address: ShippingAddress) => {
      if (!user || cart.length === 0) return;
      setIsProcessing(true);
      setErrorMsg(null);

      try {
        const res = await fetch("/api/preorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            items: cart.map((i) => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              slug: i.slug,
            })),
            amount: cartTotal,
            shippingAddress: address,
            customerName: address.name,
            customerEmail: address.email,
          }),
        });

        if (!res.ok) throw new Error("Failed to place pre-order");

        await clearCart();
        setStep("success");
        setTimeout(() => toggleCart(), 4000);
      } catch {
        setErrorMsg("Something went wrong. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [user, cart, cartTotal, clearCart, toggleCart]
  );

  /* ─── Step 2b: Address submitted → pay (standard flow) ─── */
  const handleAddressSubmit = useCallback(
    async (address: ShippingAddress) => {
      if (!user || cart.length === 0) return;
      setIsProcessing(true);
      setErrorMsg(null);

      try {
        // 1️⃣ Load Razorpay SDK
        await loadRazorpayScript();

        // 2️⃣ Create order on backend
        const orderRes = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: cartTotal }),
        });
        if (!orderRes.ok) throw new Error("Failed to create payment order");
        const { orderId, amount, currency } = await orderRes.json();

        // 3️⃣ Open Razorpay modal
        const options: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RZP_TEST_KEY_ID!,
          amount,
          currency,
          name: "Sareine",
          description: "Premium Natural Products",
          order_id: orderId,
          handler: async (response: RazorpayResponse) => {
            try {
              // 4️⃣ Verify payment + send email (server-side)
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  shippingAddress: address,
                  cart: cart.map((i) => ({
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                  })),
                  amount: cartTotal,
                  customerName: address.name,
                  customerEmail: address.email,
                }),
              });
              if (!verifyRes.ok) throw new Error("Payment verification failed");

              // 5️⃣ Save order to Firestore (client-side)
              await addDoc(collection(db, "orders"), {
                userId: user.uid,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                items: cart.map((i) => ({
                  id: i.id,
                  name: i.name,
                  price: i.price,
                  quantity: i.quantity,
                  slug: i.slug,
                })),
                amount: cartTotal,
                currency: "INR",
                status: "paid",
                shippingAddress: address,
                createdAt: serverTimestamp(),
              });

              // 6️⃣ Clear cart & show success
              await clearCart();
              setStep("success");
              setTimeout(() => toggleCart(), 3000);
            } catch {
              setErrorMsg("Payment verification failed. Please contact support.");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: address.name,
            email: address.email,
            contact: address.phone,
          },
          theme: { color: "#B49B6E" },
          modal: {
            ondismiss: () => setIsProcessing(false),
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch {
        setErrorMsg("Something went wrong. Please try again.");
        setIsProcessing(false);
      }
    },
    [user, cart, cartTotal, clearCart, toggleCart]
  );

  if (!isCartOpen) return null;

  /* ─── Render ─── */
  return (
    <div className={styles.wrapper}>
      <div className={styles.backdrop} onClick={toggleCart} aria-hidden />

      <aside
        ref={cartRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* ── Header ── */}
        <header className={styles.header}>
          <h2 className={styles.title}>
            {step === "address" ? "Checkout" : "Your Bag"}
            {step === "cart" && (
              <span className={styles.count}>({cart.length})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={toggleCart}
            className={styles.closeBtn}
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              width={24}
              height={24}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        {/* ── Scroll area ── */}
        <div className={styles.scrollArea}>
          {/* Error banner */}
          {errorMsg && (
            <div className={styles.errorBanner} role="alert">
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── SUCCESS view ── */}
          {step === "success" && (
            <div className={styles.successWrap}>
              <div className={styles.successIcon}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width={48}
                  height={48}
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className={styles.successTitle}>
                {IS_PREORDER ? "Pre-order Placed!" : "Payment Successful!"}
              </h3>
              <p className={styles.successText}>
                {IS_PREORDER
                  ? "Thank you! We\u2019ll send you a payment link once your order is ready."
                  : "Thank you for your order. A confirmation email has been sent."}
              </p>
            </div>
          )}

          {/* ── ADDRESS view ── */}
          {step === "address" && (
            <>
              {/* Order summary mini */}
              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </span>
                  <span className={styles.summaryValue}>₹{cartTotal}</span>
                </div>
              </div>

              <AddressForm
                onSubmit={IS_PREORDER ? handlePreorderSubmit : handleAddressSubmit}
                onBack={() => {
                  setStep("cart");
                  setErrorMsg(null);
                }}
                isProcessing={isProcessing}
                defaultName={user?.displayName ?? undefined}
                defaultEmail={user?.email ?? undefined}
              />
            </>
          )}

          {/* ── CART view ── */}
          {step === "cart" && (
            <>
              {cart.length === 0 ? (
                <div className={styles.emptyWrap}>
                  <svg
                    className={styles.emptyIcon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={0.75}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                    />
                  </svg>
                  <h3 className={styles.emptyTitle}>Your bag is empty</h3>
                  <p className={styles.emptyText}>
                    Discover our collection of nature&apos;s finest balms.
                  </p>
                  <button
                    type="button"
                    onClick={toggleCart}
                    className={styles.emptyCta}
                  >
                    Start shopping
                  </button>
                </div>
              ) : (
                <div className={styles.itemsList}>
                  {cart.map((item) => {
                    // Helper to get hardcoded image based on product name/slug
                    const getProductImage = (name: string, currentImage: string) => {
                      const lowerName = name.toLowerCase();
                      if (lowerName.includes('limited edition')) return '/sareine-limited-edition-natural-lip-balm.png';
                      if (lowerName.includes('beetroot')) return '/sareine-natural-beetroot-lip-balm.jpeg';
                      if (lowerName.includes('pink rose')) return '/sareine-natural-pink-rose-lip-balm.jpeg';
                      if (lowerName.includes('rose')) return '/sareine-natural-rose-lip-balm.jpeg';
                      return currentImage;
                    };

                    const displayImage = getProductImage(item.name, item.image);

                    return (
                      <div key={item.id} className={styles.itemRow}>
                        <div className={styles.itemImageWrap}>
                          <Image
                            src={displayImage}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className={styles.itemImage}
                          />
                        </div>
                        <div className={styles.itemContent}>
                          <div className={styles.itemTop}>
                            <h3 className={styles.itemName}>{item.name}</h3>
                            <span className={styles.itemPrice}>
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                          <div className={styles.itemActions}>
                            <div className={styles.quantityWrap}>
                              <button
                                type="button"
                                onClick={() => decreaseQuantity(item.id)}
                                className={styles.quantityBtn}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className={styles.quantityValue}>
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => addToCart(item)}
                                className={styles.quantityBtn}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className={styles.removeBtn}
                              aria-label="Remove item"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Gifts section */}
              {GIFTS.length > 0 && (
                <section
                  className={styles.giftsSection}
                  aria-label="Gifts and promotions"
                >
                  {GIFTS.map((gift) => (
                    <div key={gift.id} className={styles.giveawayCard}>
                      <div className={styles.giveawayBadge}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width={12}
                          height={12}
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {gift.badgeText}
                      </div>
                      <div className={styles.giveawayImageWrap}>
                        <Image
                          src={gift.image}
                          alt={gift.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 380px"
                          className={styles.giveawayImage}
                        />
                      </div>
                      <div className={styles.giveawayContent}>
                        <h4 className={styles.giveawayTitle}>{gift.title}</h4>
                        <p className={styles.giveawayTagline}>
                          {gift.tagline}
                        </p>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
        </div>

        {/* ── Footer (cart view only) ── */}
        {step === "cart" && cart.length > 0 && (
          <footer className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span className={styles.subtotalLabel}>Subtotal</span>
              <span className={styles.subtotalValue}>₹{cartTotal}</span>
            </div>
            <p className={styles.footerNote}>
              Shipping, taxes and discounts calculated at checkout.
            </p>
            <button
              type="button"
              className={styles.checkoutBtn}
              aria-label="Proceed to checkout"
              onClick={handleCheckoutClick}
            >
              {IS_PREORDER ? "Pre-order Now" : "Checkout"}
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
                  d="M5 12h14M13 5l6 7-6 7"
                />
              </svg>
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
