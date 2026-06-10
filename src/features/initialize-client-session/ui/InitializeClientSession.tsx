"use client";

// For applying global client-side effects like auth state monitoring and background music

import type { User } from "firebase/auth";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { signIn } from "@/features/authenticate-user/api/authApis";
// Firebase module
import { onAuthStateChangedListener } from "@/features/authenticate-user/api/firebase";
import { useUser } from "@/features/authenticate-user/model/userStore";
import { useProfile } from "@/features/manage-user-profile/model/profileStore";
import { getWallet } from "@/features/manage-wallet/api/walletApis";
import { useCoins, useXP } from "@/features/manage-wallet/model/walletStore";

const InitializeClientSession = (): null => {
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
	const setName = useProfile((state) => state.setName);
	const setEmail = useProfile((state) => state.setEmail);
	const setPic = useProfile((state) => state.setPic);

	// Track pending sign-in attempts
	const pendingSignInRef = useRef<Map<string, boolean>>(new Map());

	// Handle user authentication and backend sign-in
	useEffect(() => {
		const unsubscribe = onAuthStateChangedListener(
			async (firebaseUser): Promise<void> => {
				if (!firebaseUser) {
					// User signed out — auth state is resolved
					setUser(null);
					setAuthReady(true);
					setName("player");
					setEmail("empty@empty.empty");
					setPic("empty.empty");
					return;
				}

				// Check if we've already processed this user
				const userId = firebaseUser.uid;
				if (pendingSignInRef.current.get(userId)) {
					return; // Already processing
				}

				pendingSignInRef.current.set(userId, true);
				try {
					// Step 1: Get Firebase token
					const idToken = await firebaseUser.getIdToken();

					// Step 2: Sign in to backend
					const backendUser = await signIn(idToken);
					console.log("Backend user data:", backendUser);

					// Step 3: Update user state
					setUser(firebaseUser);
					setName(backendUser.name);
					setEmail(backendUser.email);
					setPic(backendUser.profile_pic);

					// Step 4: Get wallet
					const wallet = await getWallet(idToken);
					if (wallet.success) {
						setCoins(wallet.coins);
						setXP(wallet.xp);
						setAuthReady(true);
					} else {
						toast.error("get wallet failed");
						setAuthReady(true);
					}
				} catch (error) {
					console.error("Auth error:", error);
					toast.error("Authentication failed");
					setAuthReady(true);
				} finally {
					pendingSignInRef.current.delete(userId);
				}
			},
		);

		return (): void => unsubscribe();
	}, [setUser, setAuthReady, setCoins, setXP, setName, setEmail, setPic]);

	return null;
};
export default InitializeClientSession;
