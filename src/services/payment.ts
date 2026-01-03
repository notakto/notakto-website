import { toast } from "react-toastify";
import { TOAST_DURATION, TOAST_IDS } from "@/constants/toast";

export const handleBuyCoins = async (
	setIsProcessingPayment: (val: boolean) => void,
	canShowToast: () => boolean,
	resetCooldown: () => void,
	setCoins: (val: number) => void,
	Coins: number,
) => {
	setIsProcessingPayment(true);

	try {
		const response = await fetch("/api/create-payment", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				amount: "1.00",
				currency: "INR",
				customerId: "user_123",
				customerName: "Test User",
			}),
		});

		const data = await response.json();

		if (data.success) {
			const paymentWindow = window.open(data.paymentUrl, "_blank");

			if (!paymentWindow) {
				if (canShowToast()) {
					toast("Popup blocked. Please allow popups and try again.", {
						toastId: TOAST_IDS.Payment.PopupBlocked,
						autoClose: TOAST_DURATION,
						onClose: resetCooldown,
					});
				}
				return;
			}

			checkPaymentStatus(
				data.chargeId,
				paymentWindow,
				() => {
					toast.dismiss(TOAST_IDS.Payment.Failure);
					toast.dismiss(TOAST_IDS.Payment.PopupBlocked);
					resetCooldown();

					if (canShowToast()) {
						toast("✅ Payment successful! 100 coins added to your account.", {
							toastId: TOAST_IDS.Payment.Success,
							autoClose: TOAST_DURATION,
							onClose: resetCooldown,
						});
					}
					setCoins(Coins + 100);
				},
				(reason) => {
					if (canShowToast()) {
						toast(`❌ ${reason}`, {
							toastId: TOAST_IDS.Payment.Failure,
							autoClose: TOAST_DURATION,
							onClose: resetCooldown,
						});
					}
				},
			);
		} else if (canShowToast()) {
			toast("Payment failed: Could not initiate payment", {
				toastId: TOAST_IDS.Payment.Failure,
				autoClose: TOAST_DURATION,
				onClose: resetCooldown,
			});
		}
	} catch (error) {
		if (canShowToast()) {
			toast(`Payment processing failed: ${error}`, {
				toastId: TOAST_IDS.Payment.Failure,
				autoClose: TOAST_DURATION,
				onClose: resetCooldown,
			});
		}
	} finally {
		setIsProcessingPayment(false);
	}
};

export const checkPaymentStatus = async (
	chargeId: string,
	paymentWindow: Window | null,
	onSuccess: () => void,
	onFailure: (reason: string) => void,
): Promise<void> => {
	const intervalId = setInterval(async () => {
		if (paymentWindow?.closed) {
			clearInterval(intervalId);
			onFailure("Payment was manually cancelled.");
			return;
		}

		try {
			const response = await fetch(`/api/order-status/${chargeId}`);
			const data = await response.json();

			if (data.status === "paid" || data.status === "confirmed") {
				clearInterval(intervalId);
				paymentWindow?.close();
				onSuccess();
			} else if (data.status === "expired" || data.status === "canceled") {
				clearInterval(intervalId);
				paymentWindow?.close();
				onFailure("Payment expired or failed.");
			}
		} catch {
			clearInterval(intervalId);
			paymentWindow?.close();
			onFailure("Unable to verify payment status. Please try again.");
		}
	}, 3000);
};
