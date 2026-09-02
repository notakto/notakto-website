import axios from "axios";
import z, { ZodError } from "zod";
import { UpdateUsernameResponseSchema } from "@/features/update-username/api/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
});
const updateUsername = async (idToken: string, username: string) => {
	try {
		const { data } = await apiClient.post(
			"/update-username",
			{ username: username },
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			},
		);

		return UpdateUsernameResponseSchema.parse(data);
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
			throw new Error(`Update username failed (${status}): ${details}`);
		}

		throw error;
	}
};
export default updateUsername;
