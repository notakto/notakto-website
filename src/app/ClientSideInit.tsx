"use client";

// For applying global client-side effects like auth state monitoring and background music

import type { User } from "firebase/auth";
import { useEffect } from "react";
// Firebase module
import { onAuthStateChangedListener } from "@/services/firebase";
import { useCoins, useUser, useXP } from "@/services/store";

const ClientSideInit = (): null => {
	const setCoins = useCoins(
		(state): ((newCoins: number) => void) => state.setCoins,
	);
	const setXP = useXP((state): ((newXP: number) => void) => state.setXP);
	const setUser = useUser(
		(state): ((newUser: User | null) => void) => state.setUser,
	);

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
	return null;
};
export default ClientSideInit;
