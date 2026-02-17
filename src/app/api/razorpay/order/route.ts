import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RZP_TEST_KEY_ID!,
            key_secret: process.env.RZP_KEY_SECRET!,
        });

        const { amount } = await req.json();

        if (!amount || typeof amount !== "number" || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 }
            );
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100), // Convert INR to paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        // Log environment variable presence (safely)
        console.log("RZP_TEST_KEY_ID exists:", !!process.env.RZP_TEST_KEY_ID);
        console.log("RZP_KEY_SECRET exists:", !!process.env.RZP_KEY_SECRET);

        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
