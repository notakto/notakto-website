import axios from "axios";
import {
	CreateChargeResponseSchema,
	PaymentStatusResponseSchema,
} from "@/features/buy-coins/api/schema";
import type {
	CreateChargeResult,
	PaymentStatusResult,
} from "@/features/buy-coins/model/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
});

export async function createCharge(
	packageId: string,
	idToken: string,
): Promise<CreateChargeResult> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}

	try {
		const { data } = await apiClient.post(
			"/create-charge",
			{ packageId },
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			},
		);

		const parsed = CreateChargeResponseSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data };
	} catch (error) {
		console.error("Create charge API error:", error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const statusText = error.response?.statusText ?? "";
			const text =
				typeof error.response?.data === "string" ? error.response.data : "";
			return {
				success: false,
				error: `Create charge failed: ${status} ${statusText} ${text}`,
			};
		}

		return { success: false, error: "Failed to create charge" };
	}
}

export async function getPaymentStatus(
	chargeId: string,
	idToken: string,
): Promise<PaymentStatusResult> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}

	try {
		const { data } = await apiClient.get("/payment-status", {
			params: { chargeId },
			headers: {
				Authorization: `Bearer ${idToken}`,
			},
		});

		const parsed = PaymentStatusResponseSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data };
	} catch (error) {
		console.error("Payment status API error:", error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const statusText = error.response?.statusText ?? "";
			const text =
				typeof error.response?.data === "string" ? error.response.data : "";
			return {
				success: false,
				error: `Payment status failed: ${status} ${statusText} ${text}`,
			};
		}

		return { success: false, error: "Failed to fetch payment status" };
	}
}
