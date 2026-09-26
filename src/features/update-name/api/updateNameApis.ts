import axios from "axios";
import z, { ZodError } from "zod";
import { UpdateNameResponseSchema } from "@/features/update-name/api/schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
});
const updateName = async (idToken: string, name: string) => {
	try {
		const { data } = await apiClient.post(
			"/update-name",
			{ name: name },
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			},
		);

		return UpdateNameResponseSchema.parse(data);
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
			throw new Error(`Update name failed (${status}): ${details}`);
		}

		throw error;
	}
};
export default updateName;
