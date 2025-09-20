import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Initialize Firebase
//Production environment
const firebaseConfig = {
    apiKey: "AIzaSyBmSkCnePbHTi2BcngOIVekwP7CxJJ0SzQ",
    authDomain: "notakto-g600.firebaseapp.com",
    projectId: "notakto-g600",
    storageBucket: "notakto-g600.firebasestorage.app",
    messagingSenderId: "200189691429",
    appId: "1:200189691429:web:14bcecc90423f59e0ce1cc",
    measurementId: "G-P2EXC36LGK"
  };
//Development environment (uncomment to use)
// Make sure to comment out the production config above if using this
// This is a demo Firebase project, if not working, please create your own Firebase project and replace the config below and env keys accordingly
// // Development Firebase config (from .env)
//const firebaseConfig = {
//  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
//  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
//};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const onAuthStateChangedListener = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
