"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    toggleCart,
    removeFromCart,
    addToCart,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node)
      ) {
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

  if (!isCartOpen) return null;

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.backdrop}
        onClick={toggleCart}
        aria-hidden
      />

      <aside
        ref={cartRef}
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>
            Your Bag
            <span className={styles.count}>({cart.length})</span>
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
          <>
            <div className={styles.itemsList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                  <div className={styles.itemImageWrap}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="100px"
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
              ))}
            </div>

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
              >
                Checkout
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
          </>
        )}
      </aside>
    </div>
  );
}
