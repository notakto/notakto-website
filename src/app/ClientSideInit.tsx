"use client";

// For applying global client-side effects like auth state monitoring and background music

import type { User } from "firebase/auth";
import { useEffect } from "react";
import { toast } from "react-toastify";
// Firebase module
import { onAuthStateChangedListener } from "@/services/firebase";
import { getWallet } from "@/services/game-apis";
import { useCoins, useUser, useXP } from "@/services/store";

const ClientSideInit = (): null => {
	const user = useUser((state) => state.user);
	const setUser = useUser(
		(state): ((newUser: User | null) => void) => state.setUser,
	);
	const setAuthReady = useUser(
		(state): ((v: boolean) => void) => state.setAuthReady,
	);
	const setCoins = useCoins(
		(state): ((newCoins: number) => void) => state.setCoins,
	);
	const setXP = useXP((state): ((newXP: number) => void) => state.setXP);

	// Load user
	useEffect((): (() => void) => {
		const unsubscribe = onAuthStateChangedListener(
			async (usr): Promise<void> => {
				if (usr) {
					setUser(usr ?? null);
					setAuthReady(true);
				}
			},
		);
		return (): void => unsubscribe();
	}, [setUser, setAuthReady]);
	useEffect(() => {
		if (user != null) {
			const fetchWallet = async () => {
				try {
					const token = await user.getIdToken();
					const wallet = await getWallet(token);

					if (wallet.success) {
						setCoins(wallet.coins);
						setXP(wallet.xp);
					} else {
						toast.error("get wallet failed");
					}
				} catch (err) {
					console.error("Error fetching wallet:", err);
					toast.error("Something went wrong while fetching wallet");
				}
			};

			fetchWallet();
		}
	}, [user, setCoins, setXP]);

	return null;
};
export default ClientSideInit;
