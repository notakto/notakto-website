import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBmSkCnePbHTi2BcngOIVekwP7CxJJ0SzQ",
    authDomain: "notakto-g600.firebaseapp.com",
    projectId: "notakto-g600",
    storageBucket: "notakto-g600.firebasestorage.app",
    messagingSenderId: "200189691429",
    appId: "1:200189691429:web:14bcecc90423f59e0ce1cc",
    measurementId: "G-P2EXC36LGK"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
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

export const saveEconomyToFirestore = async (
  userId: string,
  coins: number,
  XP: number
) => {
  const userRef = doc(firestore, 'users', userId);
  await setDoc(userRef, { coins, XP }, { merge: true });
};

export const loadEconomyFromFirestore = async (
  userId: string
) => {
  const userRef = doc(firestore, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() || null;
  }
  return null;
};
