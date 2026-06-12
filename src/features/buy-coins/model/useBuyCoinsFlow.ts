"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCoins, useUser, useXP } from "@/features/app-state/model/stores";
import { signInWithGoogle } from "@/features/authenticate-user/api/firebase";
import { getWallet } from "@/features/backend-game/api/gameApis";
import {
	createCharge,
	getPaymentStatus,
} from "@/features/buy-coins/api/buyCoinsApis";
import {
	BUY_COIN_PACKAGES,
	DEFAULT_BUY_COIN_PACKAGE_ID,
} from "@/features/buy-coins/model/packages";
import type {
	BuyCoinsFlowStatus,
	BuyCoinsProviderStatus,
} from "@/features/buy-coins/model/types";

const PAYMENT_POLL_INTERVAL_MS = 5000;
const PAYMENT_POLL_TIMEOUT_MS = 5 * 60 * 1000;

export function useBuyCoinsFlow() {
	const user = useUser((state) => state.user);
	const authReady = useUser((state) => state.authReady);
	const currentCoins = useCoins((state) => state.coins);
	const setCoins = useCoins((state) => state.setCoins);
	const setXP = useXP((state) => state.setXP);

	const [selectedPackageId, setSelectedPackageId] = useState(
		DEFAULT_BUY_COIN_PACKAGE_ID,
	);
	const [flowStatus, setFlowStatus] = useState<BuyCoinsFlowStatus>("idle");
	const [providerStatus, setProviderStatus] =
		useState<BuyCoinsProviderStatus>(null);
	const [chargeId, setChargeId] = useState<string | null>(null);
	const [hostedUrl, setHostedUrl] = useState<string | null>(null);
	const [checkoutOpenBlocked, setCheckoutOpenBlocked] = useState(false);
	const [confirmedAmountCents, setConfirmedAmountCents] = useState<
		number | null
	>(null);
	const [error, setError] = useState<string | null>(null);

	const pollingIntervalRef = useRef<number | null>(null);
	const pollingDeadlineRef = useRef<number | null>(null);

	const selectedPackage = useMemo(
		() =>
			BUY_COIN_PACKAGES.find((item) => item.id === selectedPackageId) ??
			BUY_COIN_PACKAGES[0],
		[selectedPackageId],
	);

	const stopPolling = useCallback(() => {
		if (pollingIntervalRef.current !== null) {
			window.clearInterval(pollingIntervalRef.current);
			pollingIntervalRef.current = null;
		}
		pollingDeadlineRef.current = null;
	}, []);

	const resetPaymentState = useCallback(() => {
		stopPolling();
		setFlowStatus("idle");
		setProviderStatus(null);
		setChargeId(null);
		setHostedUrl(null);
		setCheckoutOpenBlocked(false);
		setConfirmedAmountCents(null);
		setError(null);
	}, [stopPolling]);

	const selectPackage = useCallback(
		(packageId: string) => {
			if (flowStatus === "creating" || flowStatus === "polling") return;
			setSelectedPackageId(packageId);
			resetPaymentState();
		},
		[flowStatus, resetPaymentState],
	);

	const openHostedCheckout = useCallback(
		(url = hostedUrl) => {
			if (!url || typeof window === "undefined") return false;

			const checkoutWindow = window.open(url, "_blank", "noopener,noreferrer");
			const blocked = !checkoutWindow;
			setCheckoutOpenBlocked(blocked);
			return !blocked;
		},
		[hostedUrl],
	);

	const refreshWallet = useCallback(
		async (idToken: string) => {
			const wallet = await getWallet(idToken);
			if (wallet.success) {
				setCoins(wallet.coins);
				setXP(wallet.xp);
				return true;
			}

			setError("Payment confirmed, but wallet refresh failed");
			return false;
		},
		[setCoins, setXP],
	);

	const pollPayment = useCallback(
		async (nextChargeId: string, idToken: string) => {
			if (
				pollingDeadlineRef.current !== null &&
				Date.now() >= pollingDeadlineRef.current
			) {
				stopPolling();
				setFlowStatus("timeout");
				setError("Payment status timed out");
				return;
			}

			const statusResult = await getPaymentStatus(nextChargeId, idToken);
			if (!statusResult.success) {
				stopPolling();
				setFlowStatus("failed");
				setError(statusResult.error);
				return;
			}

			setProviderStatus(statusResult.status);
			setConfirmedAmountCents(statusResult.amountCents);

			if (statusResult.status === "confirmed") {
				stopPolling();
				const walletRefreshed = await refreshWallet(idToken);
				setFlowStatus("confirmed");
				if (walletRefreshed) {
					setError(null);
				}
				return;
			}

			if (statusResult.status === "failed") {
				stopPolling();
				setFlowStatus("failed");
				setError("Payment failed");
			}
		},
		[refreshWallet, stopPolling],
	);

	const startPolling = useCallback(
		(nextChargeId: string, idToken: string) => {
			stopPolling();
			pollingDeadlineRef.current = Date.now() + PAYMENT_POLL_TIMEOUT_MS;
			setFlowStatus("polling");
			void pollPayment(nextChargeId, idToken);
			pollingIntervalRef.current = window.setInterval(() => {
				void pollPayment(nextChargeId, idToken);
			}, PAYMENT_POLL_INTERVAL_MS);
		},
		[pollPayment, stopPolling],
	);

	const startCheckout = useCallback(async () => {
		if (!user) {
			setError("Sign in required");
			return;
		}

		stopPolling();
		setFlowStatus("creating");
		setProviderStatus(null);
		setChargeId(null);
		setHostedUrl(null);
		setCheckoutOpenBlocked(false);
		setConfirmedAmountCents(null);
		setError(null);

		try {
			const idToken = await user.getIdToken();
			const chargeResult = await createCharge(selectedPackage.id, idToken);
			if (!chargeResult.success) {
				setFlowStatus("failed");
				setError(chargeResult.error);
				return;
			}

			setChargeId(chargeResult.chargeId);
			setHostedUrl(chargeResult.hostedUrl);
			openHostedCheckout(chargeResult.hostedUrl);
			startPolling(chargeResult.chargeId, idToken);
		} catch (checkoutError) {
			console.error("Buy coins checkout failed:", checkoutError);
			setFlowStatus("failed");
			setError("Failed to start checkout");
		}
	}, [openHostedCheckout, selectedPackage.id, startPolling, stopPolling, user]);

	const signIn = useCallback(async () => {
		setError(null);
		try {
			await signInWithGoogle();
		} catch (signInError) {
			console.error("Buy coins sign-in failed:", signInError);
			setError("Sign in failed");
		}
	}, []);

	useEffect(() => () => stopPolling(), [stopPolling]);

	return {
		authReady,
		chargeId,
		checkoutOpenBlocked,
		confirmedAmountCents,
		currentCoins,
		error,
		flowStatus,
		hostedUrl,
		isBusy: flowStatus === "creating" || flowStatus === "polling",
		openHostedCheckout,
		packages: BUY_COIN_PACKAGES,
		providerStatus,
		resetPaymentState,
		selectPackage,
		selectedPackage,
		selectedPackageId,
		signIn,
		startCheckout,
		user,
	};
}
