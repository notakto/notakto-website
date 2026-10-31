import axios from "axios";
import z, { ZodError } from "zod";
import { LeaderBoardResponseSchema } from "@/features/get-leaderboard/api/schema";

import apiClient from "@/lib/apiClient";

const getLeaderboard = async (idToken: string) => {
	try {
		const { data } = await apiClient.get("/leaderboard", {
			headers: {
				Authorization: `Bearer ${idToken}`,
			},
		});

		return LeaderBoardResponseSchema.parse(data);
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
				(error.response?.data
					? JSON.stringify(error.response.data)
					: error.message);

			throw new Error(`Leaderboard can't be fetched (${status}): ${details}`);
		}

		throw error;
	}
};

export default getLeaderboard;
