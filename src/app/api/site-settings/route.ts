import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

const SETTINGS_DOC = "site_config";

export async function GET() {
    try {
        const doc = await adminDb.collection("settings").doc(SETTINGS_DOC).get();

        if (!doc.exists) {
            return NextResponse.json({
                settings: {
                    preorderEnabled: false,
                    announcementText: "",
                    senderName: "Sareine",
                },
            });
        }

        return NextResponse.json({ settings: doc.data() });
    } catch (error) {
        console.error("Site settings GET error:", error);
        return NextResponse.json(
            {
                settings: {
                    preorderEnabled: process.env.NEXT_PUBLIC_ENABLE_PREORDER === "true",
                    announcementText: "",
                    senderName: "Sareine",
                },
            },
        );
    }
}
