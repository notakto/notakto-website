"use client"

// For applying global client-side effects like auth state monitoring and background music


import { useEffect } from "react";
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { useUser, useCoins, useXP } from '@/services/store';
import { User } from "firebase/auth";


// Firebase module
import { onAuthStateChangedListener } from '@/services/firebase';


const ClientSideInit = (): null => {
    const user = useUser((state) => state.user);
    const setCoins = useCoins((state): (newCoins: number) => void => (state.setCoins));
    const setXP = useXP((state): (newXP: number) => void => (state.setXP));
    const setUser = useUser((state): (newUser: User | null) => void => state.setUser);
    useCoins((state): number => state.coins);
    useXP((state): number => state.XP);

    // Load user
    useEffect((): () => void => {
        const unsubscribe = onAuthStateChangedListener(async function (usr): Promise<void> {
            setUser(usr);
            if (!usr) {
                setCoins(1000);
                setXP(0);
            }
        });
        return (): void => unsubscribe();
    }, []);
    useEffect((): (() => void) | undefined => {
        if (!user) {
            console.log("No user, skipping Firestore listener setup.");
            return;
        }
        console.log("Setting up Firestore listener for user:", user.uid);
        const userRef = doc(firestore, "users", user.uid);
        console.log("User data:", userRef);
        const unsubscribe = onSnapshot(userRef, (docSnap): void => { //websocket that monitors db and pushes changes to client
            if (docSnap.exists()) {
                const data = docSnap.data();
                setCoins(data.coins ?? 1000);
                setXP(data.XP ?? 0);
            } else {
                setCoins(1000);
                setXP(0);   
            }
        },(err) => {
            console.error("Firestore user listener error:", err);
        });

        return (): void => unsubscribe();
    }, [user]);
    return null;
}
export default ClientSideInit;