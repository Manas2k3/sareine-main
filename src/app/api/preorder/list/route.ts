import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
    try {
        const snapshot = await adminDb
            .collection("preorders")
            .orderBy("createdAt", "desc")
            .get();

        const preorders = snapshot.docs.map((doc) => ({
            firestoreId: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ preorders });
    } catch (error) {
        console.error("Error fetching preorders:", error);
        return NextResponse.json(
            { error: "Failed to fetch preorders" },
            { status: 500 }
        );
    }
}
