import { adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function db(uid: string, coins: number, xp: number) {

    try {
        await adminDb.collection("users").doc(uid).set(
            {
                coins: FieldValue.increment(coins),
                XP: FieldValue.increment(xp),
                // lastUpdatedAt: FieldValue.serverTimestamp(), // better than Date.now() since prevents clock skew issues (server time vs db time)
            },
            { merge: true } // ensures we don’t overwrite the whole doc
        );
        return { success: true, status: 200 };
    } catch (error) {
        console.error("Database operation failed:", error);
        return { error: error, status: 500 };
    }
}
