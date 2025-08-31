import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export async function db(idToken: string, coins: number, xp: number) {

    try {
        const decoded = await adminAuth.verifyIdToken(idToken);
        const uid = decoded.uid;
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
        console.error("Token verification failed:", error);
        return { error: error, status: 403 };
    }
}
