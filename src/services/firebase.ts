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

// Initialize Firebase
//Production environment
const firebaseConfig = {
	apiKey: "AIzaSyBmSkCnePbHTi2BcngOIVekwP7CxJJ0SzQ",
	authDomain: "notakto-g600.firebaseapp.com",
	projectId: "notakto-g600",
	storageBucket: "notakto-g600.firebasestorage.app",
	messagingSenderId: "200189691429",
	appId: "1:200189691429:web:14bcecc90423f59e0ce1cc",
	measurementId: "G-P2EXC36LGK",
};
//Development environment (uncomment to use)
// Make sure to comment out the production config above if using this
// This is a demo Firebase project, if not working, please create your own Firebase project and replace the config below and env keys accordingly
// const firebaseConfig = {
//   apiKey: "AIzaSyAFRKoQm30ekwQQOeunqB3X6D26wOP8huk",
//   authDomain: "notakto-3359b.firebaseapp.com",
//   projectId: "notakto-3359b",
//   storageBucket: "notakto-3359b.firebasestorage.app",
//   messagingSenderId: "467221757682",
//   appId: "1:467221757682:web:9d896324f25e6dce03da6b",
//   measurementId: "G-MLBPJWB1C2"
// };

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
