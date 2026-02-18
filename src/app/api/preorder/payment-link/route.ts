import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { adminDb } from "@/lib/firebase/admin";
import { sendPaymentLinkEmail } from "@/lib/email/service";

export async function POST(req: NextRequest) {
    try {
        const { firestoreId } = (await req.json()) as { firestoreId: string };

        if (!firestoreId) {
            return NextResponse.json(
                { error: "Missing firestoreId" },
                { status: 400 }
            );
        }

        // Fetch preorder from Firestore
        const docRef = adminDb.collection("preorders").doc(firestoreId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json(
                { error: "Preorder not found" },
                { status: 404 }
            );
        }

        const preorder = docSnap.data()!;

        // Create Razorpay Payment Link
        const razorpay = new Razorpay({
            key_id: process.env.RZP_TEST_KEY_ID!,
            key_secret: process.env.RZP_KEY_SECRET!,
        });

        const paymentLink = await razorpay.paymentLink.create({
            amount: Math.round(preorder.amount * 100), // paise
            currency: "INR",
            accept_partial: false,
            description: `Payment for preorder ${preorder.preorderId}`,
            customer: {
                name: preorder.customerName,
                email: preorder.customerEmail,
                contact: preorder.shippingAddress.phone,
            },
            notify: {
                sms: false,
                email: false, // We'll send our own branded email
            },
            reminder_enable: true,
            notes: {
                preorderId: preorder.preorderId,
                firestoreId,
            },
            callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://sareine.in"}/order-success`,
            callback_method: "get",
        });

        // Update Firestore status
        await docRef.update({
            status: "payment_link_sent",
            razorpayPaymentLinkId: paymentLink.id,
            razorpayPaymentLinkUrl: paymentLink.short_url,
            updatedAt: new Date().toISOString(),
        });

        // Send payment link email
        const emailResult = await sendPaymentLinkEmail({
            customerName: preorder.customerName,
            customerEmail: preorder.customerEmail,
            preorderId: preorder.preorderId,
            amount: preorder.amount,
            paymentLink: paymentLink.short_url,
        });

        if (!emailResult.success) {
            console.error(
                "[PAYMENT LINK ROUTE] Email failed:",
                emailResult.error
            );
        }

        return NextResponse.json({
            success: true,
            paymentLinkUrl: paymentLink.short_url,
        });
    } catch (error) {
        console.error("Payment link creation error:", error);
        return NextResponse.json(
            { error: "Failed to create payment link" },
            { status: 500 }
        );
    }
}
