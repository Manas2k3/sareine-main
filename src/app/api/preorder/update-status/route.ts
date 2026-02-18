import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: NextRequest) {
    try {
        const { firestoreId, status } = (await req.json()) as {
            firestoreId: string;
            status: string;
        };

        if (!firestoreId || !status) {
            return NextResponse.json(
                { error: "Missing firestoreId or status" },
                { status: 400 }
            );
        }

        const validStatuses = [
            "pending_confirmation",
            "payment_link_sent",
            "paid",
            "dispatched",
            "delivered",
            "cancelled",
        ];

        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
                { status: 400 }
            );
        }

        const docRef = adminDb.collection("preorders").doc(firestoreId);
        await docRef.update({
            status,
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating preorder status:", error);
        return NextResponse.json(
            { error: "Failed to update status" },
            { status: 500 }
        );
    }
}
