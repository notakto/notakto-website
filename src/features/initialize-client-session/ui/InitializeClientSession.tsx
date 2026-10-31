"use client";

import type { User } from "firebase/auth";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

import { onAuthStateChangedListener } from "@/features/authenticate-user/api/firebase";
import { useUser } from "@/features/authenticate-user/model/userStore";
import { getWallet } from "@/features/manage-wallet/api/walletApis";
import { useCoins, useXP } from "@/features/manage-wallet/model/walletStore";

const InitializeClientSession = (): null => {
	const setUser = useUser((state) => state.setUser);
	const setAuthReady = useUser((state) => state.setAuthReady);
	const setCoins = useCoins((state) => state.setCoins);
	const setXP = useXP((state) => state.setXP);

	const pendingUsersRef = useRef(new Map<string, boolean>());

	useEffect(() => {
		const unsubscribe = onAuthStateChangedListener(
			async (firebaseUser: User | null): Promise<void> => {
				if (!firebaseUser) {
					setUser(null);
					setAuthReady(true);
					setCoins(0);
					setXP(0);
					return;
				}

				const userId = firebaseUser.uid;

				if (pendingUsersRef.current.has(userId)) {
					return;
				}

				pendingUsersRef.current.set(userId, true);
				setAuthReady(false);
				setUser(firebaseUser);

				try {
					const idToken = await firebaseUser.getIdToken();
					const wallet = await getWallet(idToken);

					if (wallet.success) {
						setCoins(wallet.coins);
						setXP(wallet.xp);
					} else {
						toast.error("Failed to load wallet");
					}
				} catch (error) {
					console.error("Session initialization error:", error);
					toast.error("Failed to initialize session");
				} finally {
					setAuthReady(true);
					pendingUsersRef.current.delete(userId);
				}
			},
		);

		return () => unsubscribe();
	}, [setUser, setAuthReady, setCoins, setXP]);

	return null;
};

export default InitializeClientSession;
