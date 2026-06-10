import axios from "axios";
import type { ErrorResponse } from "@/entities/game/model/types";
import {
	type GetWalletResponse,
	GetWalletResponseSchema,
} from "@/features/manage-wallet/api/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
});

export async function getWallet(
	idToken: string,
): Promise<GetWalletResponse | ErrorResponse> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}

	try {
		const { data } = await apiClient.get("/get-wallet", {
			headers: {
				Authorization: `Bearer ${idToken}`,
			},
		});

		const parsed = GetWalletResponseSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { ...parsed.data };
	} catch (error) {
		console.error("Get wallet error:", error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const statusText = error.response?.statusText ?? "";
			const text =
				typeof error.response?.data === "string" ? error.response.data : "";
			return {
				success: false,
				error: `get-wallet failed: ${status} ${statusText} ${text}`,
			};
		}

		return { success: false, error: "Failed to fetch wallet" };
	}
}
