"use client";

import type { User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useShortcut } from "@/components/hooks/useShortcut";
import { firestore, onAuthStateChangedListener } from "@/services/firebase";
import { pageShortcuts } from "@/services/pageShortcut";
import { useCoins, useUser, useXP } from "@/services/store";

const ClientSideInit = (): null => {
	const user = useUser((state) => state.user);
	const setCoins = useCoins(
		(state): ((newCoins: number) => void) => state.setCoins,
	);
	const setXP = useXP((state): ((newXP: number) => void) => state.setXP);
	const setUser = useUser(
		(state): ((newUser: User | null) => void) => state.setUser,
	);

	// Register the shortcuts for the current page with the ShortcutManager
	const pathname = usePathname();
	const shortcuts = pageShortcuts[pathname] || {};
	useShortcut(shortcuts);

	// Load user
	useEffect((): (() => void) => {
		const unsubscribe = onAuthStateChangedListener(
			async (usr): Promise<void> => {
				setUser(usr);
				if (!usr) {
					setCoins(1000);
					setXP(0);
				}
			},
		);
		return (): void => unsubscribe();
	}, [setCoins, setUser, setXP]);
	useEffect((): (() => void) | undefined => {
		if (!user) {
			console.log("No user, skipping Firestore listener setup.");
			return;
		}
		console.log("Setting up Firestore listener for user:", user.uid);
		const userRef = doc(firestore, "users", user.uid);
		console.log("User data:", userRef);
		const unsubscribe = onSnapshot(
			userRef,
			(docSnap): void => {
				if (docSnap.exists()) {
					const data = docSnap.data();
					setCoins(data.coins ?? 1000);
					setXP(data.XP ?? 0);
				} else {
					setCoins(1000);
					setXP(0);
				}
			},
			(err) => {
				console.error("Firestore user listener error:", err);
			},
		);

		return (): void => unsubscribe();
	}, [user, setCoins, setXP]);
	return null;
};
export default ClientSideInit;
