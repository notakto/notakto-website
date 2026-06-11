import axios from "axios";
import { ZodError, z } from "zod";
import {
	type SignInResponse,
	SignInResponseSchema,
} from "@/features/authenticate-user/api/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
	throw new Error("NEXT_PUBLIC_API_URL is not defined");
}
const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
});

export async function signIn(idToken: string): Promise<SignInResponse> {
	if (!API_URL) {
		throw new Error("API URL is not defined");
	}

	try {
		const { data } = await apiClient.post("/sign-in", null, {
			headers: {
				Authorization: `Bearer ${idToken}`,
			},
		});

		return SignInResponseSchema.parse(data);
	} catch (error) {
		if (error instanceof ZodError) {
			const tree = z.treeifyError(error);
			console.error("Zod validation errors:", tree);
			throw new Error("Invalid response format from server");
		}

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const details =
				error.response?.data?.message ??
				JSON.stringify(error.response?.data) ??
				error.message;
			throw new Error(`Sign-in failed (${status}): ${details}`);
		}

		throw error;
	}
}
