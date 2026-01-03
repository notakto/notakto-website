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
import { type ApiError, NormalizeApiError } from "@/utils/apiError";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

export type AuthResult = { success: true; user: User } | ApiError;

export const signInWithGoogle = async (): Promise<AuthResult> => {
	try {
		const result = await signInWithPopup(auth, provider);
		return { success: true, user: result.user };
	} catch (error) {
		return NormalizeApiError(error, "Google sign-in failed");
	}
};

export const signOutUser = async (): Promise<{ success: true } | ApiError> => {
	try {
		await signOut(auth);
		return { success: true };
	} catch (error) {
		return NormalizeApiError(error, "Failed to sign out");
	}
};

export const onAuthStateChangedListener = (
	callback: (user: User | null) => void,
): (() => void) => {
	return onAuthStateChanged(auth, callback);
};
