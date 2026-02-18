import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { sendPreorderConfirmationEmail } from "@/lib/email/service";

interface CartItem {
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

export async function POST(req: NextRequest) {
    try {
        const {
            userId,
            items,
            amount,
            shippingAddress,
            customerName,
            customerEmail,
        } = (await req.json()) as {
            userId: string;
            items: CartItem[];
            amount: number;
            shippingAddress: ShippingAddress;
            customerName: string;
            customerEmail: string;
        };

        // Validate required fields
        if (
            !userId ||
            !items?.length ||
            !amount ||
            !shippingAddress ||
            !customerName ||
            !customerEmail
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Generate a human-friendly preorder ID
        const preorderRef = adminDb.collection("preorders").doc();
        const preorderId = `PRE-${Date.now().toString(36).toUpperCase()}`;

        // Save to Firestore
        await preorderRef.set({
            preorderId,
            userId,
            items,
            amount,
            currency: "INR",
            shippingAddress,
            customerName,
            customerEmail,
            status: "pending_confirmation", // pending_confirmation → payment_link_sent → paid → dispatched → delivered
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Send confirmation email
        const emailResult = await sendPreorderConfirmationEmail({
            customerName,
            customerEmail,
            preorderId,
            items,
            amount,
            shippingAddress,
        });

        if (!emailResult.success) {
            console.error("[PREORDER ROUTE] Email failed:", emailResult.error);
            // Still return success — order was saved
        } else {
            console.log(
                "[PREORDER ROUTE] Confirmation email sent to:",
                customerEmail
            );
        }

        return NextResponse.json({
            success: true,
            preorderId,
            firestoreId: preorderRef.id,
        });
    } catch (error) {
        console.error("Preorder creation error:", error);
        return NextResponse.json(
            { error: "Failed to create preorder" },
            { status: 500 }
        );
    }
}
