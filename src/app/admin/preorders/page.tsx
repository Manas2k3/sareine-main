"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./preorders.module.css";

/* ─── Types ─── */
interface PreorderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    slug: string;
}

interface ShippingAddress {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip: string;
}

interface Preorder {
    firestoreId: string;
    preorderId: string;
    userId: string;
    items: PreorderItem[];
    amount: number;
    currency: string;
    shippingAddress: ShippingAddress;
    customerName: string;
    customerEmail: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    razorpayPaymentLinkUrl?: string;
}

/* ─── Status helpers ─── */
const STATUS_LABELS: Record<string, string> = {
    pending_confirmation: "Pending",
    payment_link_sent: "Payment Link Sent",
    paid: "Paid",
    dispatched: "Dispatched",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
    pending_confirmation: "#e6a817",
    payment_link_sent: "#3b82f6",
    paid: "#22c55e",
    dispatched: "#8b5cf6",
    delivered: "#10b981",
    cancelled: "#ef4444",
};

/* ─── Admin secret (simple gating) ─── */
const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "sareine2026";

export default function AdminPreordersPage() {
    const [isAuthed, setIsAuthed] = useState(false);
    const [secret, setSecret] = useState("");
    const [preorders, setPreorders] = useState<Preorder[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    /* ─── Fetch preorders ─── */
    const fetchPreorders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/preorder/list");
            const data = await res.json();
            setPreorders(data.preorders || []);
        } catch (err) {
            console.error("Failed to fetch preorders:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuthed) fetchPreorders();
    }, [isAuthed, fetchPreorders]);

    /* ─── Send payment link ─── */
    const handleSendPaymentLink = async (firestoreId: string) => {
        if (!confirm("Send payment link email to customer?")) return;
        setActionLoading(firestoreId);
        try {
            const res = await fetch("/api/preorder/payment-link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firestoreId }),
            });
            if (!res.ok) throw new Error("Failed");
            alert("Payment link sent successfully!");
            fetchPreorders();
        } catch {
            alert("Failed to send payment link. Check console.");
        } finally {
            setActionLoading(null);
        }
    };

    /* ─── Update status ─── */
    const handleStatusUpdate = async (firestoreId: string, status: string) => {
        setActionLoading(firestoreId);
        try {
            const res = await fetch("/api/preorder/update-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firestoreId, status }),
            });
            if (!res.ok) throw new Error("Failed");
            fetchPreorders();
        } catch {
            alert("Failed to update status.");
        } finally {
            setActionLoading(null);
        }
    };

    /* ─── Login gate ─── */
    if (!isAuthed) {
        return (
            <main className={styles.loginPage}>
                <div className={styles.loginCard}>
                    <h1 className={styles.loginTitle}>Admin Access</h1>
                    <p className={styles.loginSubtitle}>Enter the admin password to continue</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (secret === ADMIN_SECRET) {
                                setIsAuthed(true);
                            } else {
                                alert("Incorrect password");
                            }
                        }}
                    >
                        <input
                            type="password"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            className={styles.loginInput}
                            placeholder="Password"
                            autoFocus
                        />
                        <button type="submit" className={styles.loginBtn}>
                            Enter
                        </button>
                    </form>
                </div>
            </main>
        );
    }

    /* ─── Dashboard ─── */
    return (
        <main className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerInner}>
                    <h1 className={styles.headerTitle}>Pre-orders</h1>
                    <div className={styles.headerActions}>
                        <span className={styles.badge}>
                            {preorders.length} total
                        </span>
                        <button
                            type="button"
                            onClick={fetchPreorders}
                            className={styles.refreshBtn}
                            disabled={loading}
                        >
                            {loading ? "Refreshing…" : "↻ Refresh"}
                        </button>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <section className={styles.statsRow}>
                {["pending_confirmation", "payment_link_sent", "paid", "dispatched", "delivered"].map(
                    (status) => {
                        const count = preorders.filter((p) => p.status === status).length;
                        return (
                            <div key={status} className={styles.statCard}>
                                <span
                                    className={styles.statDot}
                                    style={{ background: STATUS_COLORS[status] }}
                                />
                                <span className={styles.statLabel}>
                                    {STATUS_LABELS[status]}
                                </span>
                                <span className={styles.statCount}>{count}</span>
                            </div>
                        );
                    }
                )}
            </section>

            {/* Table */}
            {loading ? (
                <div className={styles.loadingWrap}>
                    <div className={styles.spinner} />
                    <p>Loading preorders…</p>
                </div>
            ) : preorders.length === 0 ? (
                <div className={styles.emptyWrap}>
                    <p>No preorders yet.</p>
                </div>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {preorders.map((order) => (
                                <>
                                    <tr
                                        key={order.firestoreId}
                                        className={styles.tableRow}
                                        onClick={() =>
                                            setExpandedId(
                                                expandedId === order.firestoreId
                                                    ? null
                                                    : order.firestoreId
                                            )
                                        }
                                    >
                                        <td className={styles.orderId}>{order.preorderId}</td>
                                        <td>
                                            <div className={styles.customerName}>
                                                {order.customerName}
                                            </div>
                                            <div className={styles.customerEmail}>
                                                {order.customerEmail}
                                            </div>
                                        </td>
                                        <td>
                                            {order.items.map((item) => (
                                                <div key={item.id} className={styles.itemLine}>
                                                    {item.name} × {item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td className={styles.amount}>₹{order.amount}</td>
                                        <td>
                                            <span
                                                className={styles.statusBadge}
                                                style={{
                                                    background: `${STATUS_COLORS[order.status]}18`,
                                                    color: STATUS_COLORS[order.status],
                                                    borderColor: `${STATUS_COLORS[order.status]}40`,
                                                }}
                                            >
                                                {STATUS_LABELS[order.status] || order.status}
                                            </span>
                                        </td>
                                        <td className={styles.date}>
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td>
                                            <div className={styles.actionBtns}>
                                                {order.status === "pending_confirmation" && (
                                                    <button
                                                        type="button"
                                                        className={styles.sendLinkBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSendPaymentLink(order.firestoreId);
                                                        }}
                                                        disabled={actionLoading === order.firestoreId}
                                                    >
                                                        {actionLoading === order.firestoreId
                                                            ? "Sending…"
                                                            : "Send Payment Link"}
                                                    </button>
                                                )}
                                                {order.status === "paid" && (
                                                    <button
                                                        type="button"
                                                        className={styles.dispatchBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(
                                                                order.firestoreId,
                                                                "dispatched"
                                                            );
                                                        }}
                                                        disabled={actionLoading === order.firestoreId}
                                                    >
                                                        Mark Dispatched
                                                    </button>
                                                )}
                                                {order.status === "dispatched" && (
                                                    <button
                                                        type="button"
                                                        className={styles.deliveredBtn}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(
                                                                order.firestoreId,
                                                                "delivered"
                                                            );
                                                        }}
                                                        disabled={actionLoading === order.firestoreId}
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                                {order.razorpayPaymentLinkUrl && (
                                                    <a
                                                        href={order.razorpayPaymentLinkUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.linkBtn}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        View Link
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded detail row */}
                                    {expandedId === order.firestoreId && (
                                        <tr key={`${order.firestoreId}-detail`} className={styles.detailRow}>
                                            <td colSpan={7}>
                                                <div className={styles.detailGrid}>
                                                    <div className={styles.detailSection}>
                                                        <h4>Shipping Address</h4>
                                                        <p>
                                                            {order.shippingAddress.name}<br />
                                                            {order.shippingAddress.street}<br />
                                                            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                                                            {order.shippingAddress.zip}<br />
                                                            📞 {order.shippingAddress.phone}<br />
                                                            ✉️ {order.shippingAddress.email}
                                                        </p>
                                                    </div>
                                                    <div className={styles.detailSection}>
                                                        <h4>Order Details</h4>
                                                        <p>
                                                            User ID: <code>{order.userId}</code><br />
                                                            Created: {new Date(order.createdAt).toLocaleString("en-IN")}<br />
                                                            Updated: {new Date(order.updatedAt).toLocaleString("en-IN")}
                                                        </p>
                                                    </div>
                                                    <div className={styles.detailSection}>
                                                        <h4>Quick Actions</h4>
                                                        <select
                                                            className={styles.statusSelect}
                                                            value={order.status}
                                                            onChange={(e) =>
                                                                handleStatusUpdate(
                                                                    order.firestoreId,
                                                                    e.target.value
                                                                )
                                                            }
                                                        >
                                                            {Object.entries(STATUS_LABELS).map(
                                                                ([value, label]) => (
                                                                    <option key={value} value={value}>
                                                                        {label}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}
