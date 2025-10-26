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
