import axios from "axios";
import {
	CoinPackagesResponseSchema,
	CreateChargeResponseSchema,
	PaymentStatusResponseSchema,
} from "@/features/buy-coins/api/schema";
import type {
	BuyCoinsErrorResponse,
	CoinPackagesResult,
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

const messages = {
	payment: {
		errorLog: "Payment status API error",
		axiosLog: "Payment status failed",
		returnLog: "Failed to fetch payment status",
	},
	charge: {
		errorLog: "Create charge API error",
		axiosLog: "Create charge failed",
		returnLog: "Failed to create charge",
	},
	package: {
		errorLog: "Fetch Coin Packages API error",
		axiosLog: "Fetch Coin Packages failed",
		returnLog: "Failed to get the Coin Packages",
	},
} as const;

const formatApiError = (
	error: unknown,
	context: keyof typeof messages,
): BuyCoinsErrorResponse => {
	const { errorLog, axiosLog, returnLog } = messages[context];

	console.error(
		`${errorLog}:`,
		axios.isAxiosError(error) ? error.message : error,
	);

	if (axios.isAxiosError(error)) {
		const status = error.response?.status ?? "unknown";
		const statusText = error.response?.statusText ?? "";
		const text =
			typeof error.response?.data === "string" ? error.response.data : "";

		return {
			success: false,
			error: `${axiosLog}: ${status} ${statusText} ${text}`,
		};
	}

	return {
		success: false,
		error: returnLog,
	};
};

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
		return formatApiError(error, "charge");
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
		return formatApiError(error, "payment");
	}
}

export async function getCoinPackages(
	idToken: string,
): Promise<CoinPackagesResult> {
	try {
		const { data } = await apiClient.get("/all-packages", {
			headers: {
				Authorization: `Bearer ${idToken}`,
			},
		});

		const parsed = CoinPackagesResponseSchema.safeParse(data);

		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}
		return { success: true, coinPackages: parsed.data.coinPackages };
	} catch (error) {
		return formatApiError(error, "package");
	}
}
