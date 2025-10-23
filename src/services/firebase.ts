import { initializeApp } from "firebase/app";
import {
	GoogleAuthProvider,
	getAuth,
	onAuthStateChanged,
	signInWithPopup,
	signOut,
	type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const {
	NEXT_PUBLIC_FIREBASE_API_KEY,
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	NEXT_PUBLIC_FIREBASE_APP_ID,
	NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} = process.env;

if (
	!NEXT_PUBLIC_FIREBASE_API_KEY ||
	!NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
	!NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
	!NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
	!NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
	!NEXT_PUBLIC_FIREBASE_APP_ID
) {
	throw new Error("Missing required Firebase environment variables.");
}

const firebaseConfig = {
	apiKey: `${NEXT_PUBLIC_FIREBASE_API_KEY}`,
	authDomain: `${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`,
	projectId: `${NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
	storageBucket: `${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
	messagingSenderId: `${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`,
	appId: `${NEXT_PUBLIC_FIREBASE_APP_ID}`,
	measurementId: `${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID}`,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
	try {
		const result = await signInWithPopup(auth, provider);
		return result.user;
	} catch (error) {
		console.error("Google Sign-In error:", error);
		throw error;
	}
};

export const signOutUser = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error("Sign out error:", error);
		throw error;
	}
};

export const onAuthStateChangedListener = (
	callback: (user: User | null) => void,
): (() => void) => {
	return onAuthStateChanged(auth, callback);
};
