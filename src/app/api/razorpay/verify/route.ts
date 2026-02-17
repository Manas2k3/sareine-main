import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "@/lib/email/service";

interface CartItem {
    name: string;
    price: number;
    quantity: number;
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

export async function POST(req: NextRequest) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            shippingAddress,
            cart,
            amount,
            customerName,
            customerEmail,
        } = (await req.json()) as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
            shippingAddress: ShippingAddress;
            cart: CartItem[];
            amount: number;
            customerName: string;
            customerEmail: string;
        };

        // Validate required fields
        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !shippingAddress ||
            !cart?.length ||
            !amount
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify payment signature (HMAC-SHA256)
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RZP_KEY_SECRET!)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Signature verified — send confirmation email
        const emailResult = await sendOrderConfirmationEmail({
            customerName,
            customerEmail,
            razorpayPaymentId: razorpay_payment_id,
            items: cart,
            amount,
            shippingAddress,
        });

        if (!emailResult.success) {
            console.error("[VERIFY ROUTE] Email send failed:", emailResult.error);
        } else {
            console.log("[VERIFY ROUTE] Email sent successfully to:", customerEmail);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
