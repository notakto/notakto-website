import axios from "axios";
import { ZodError, z } from "zod";
import {
	type SignInResponse,
	SignInResponseSchema,
} from "@/features/authenticate-user/api/schema";

import apiClient from "@/lib/apiClient";

export async function signIn(idToken: string): Promise<SignInResponse> {
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
			console.error(`Sign-in failed (${status}): ${details}`);
			throw error;
		}

		throw error;
	}
}
