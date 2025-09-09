const PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:commit`;

export async function db(uid: string, coins: number, xp: number, idToken: string) {
  try {
    const body = {
      writes: [
        {
          transform: {
            document: `projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`,
            fieldTransforms: [
              { fieldPath: "coins", increment: { integerValue: coins } },
              { fieldPath: "XP", increment: { integerValue: xp } }
            ]
          }
        }
      ]
    };

    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idToken ? { "Authorization": `Bearer ${idToken}` } : {})
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Firestore update failed:", err);
      throw new Error(`Firestore error: ${res.status}`);
    }

    return { success: true, status: 200 };
  } catch (error) {
    console.error("Database operation failed:", error);
    return { error: error, status: 500 };
  }
}
