import axios from "axios";
import {
	CreateGameResponseSchema,
	MakeMoveResponseSchema,
	QuitGameResponseSchema,
	SkipMoveResponseSchema,
	UndoMoveResponseSchema,
} from "@/entities/game/api/schema";
import type {
	BoardSize,
	DifficultyLevel,
	ErrorResponse,
	MakeMoveResult,
	NewGameResponse,
	QuitGameResponse,
	SkipMoveResult,
	UndoMoveResult,
} from "@/entities/game/model/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000, // 10 seconds default timeout
});

export async function createGame(
	numberOfBoards: number,
	boardSize: BoardSize,
	difficulty: DifficultyLevel,
	idToken: string,
): Promise<NewGameResponse | ErrorResponse> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}

	try {
		const { data } = await apiClient.post(
			"/create-game",
			{ numberOfBoards, boardSize, difficulty },
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			},
		);

		const parsed = CreateGameResponseSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data } as NewGameResponse;
	} catch (error) {
		console.error("Create game API error:", error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const statusText = error.response?.statusText ?? "";
			const text =
				typeof error.response?.data === "string" ? error.response.data : "";
			return {
				success: false,
				error: `Create game failed: ${status} ${statusText} ${text}`,
			};
		}

		return { success: false, error: "Failed to create game" };
	}
}

export async function makeMove(
	sessionId: string,
	boardIndex: number,
	cellIndex: number,
	idToken: string,
): Promise<MakeMoveResult> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}

	try {
		const { data } = await apiClient.post(
			"/make-move",
			{ sessionId, boardIndex, cellIndex },
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			},
		);

		const parsed = MakeMoveResponseSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data };
	} catch (error) {
		console.error("Make move API error:", error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const statusText = error.response?.statusText ?? "";
			const text =
				typeof error.response?.data === "string" ? error.response.data : "";
			return {
				success: false,
				error: `Make move failed: ${status} ${statusText} ${text}`,
			};
		}

		return { success: false, error: "Failed to make move" };
	}
}

export async function quitGame(
	sessionId: string,
	idToken: string,
): Promise<QuitGameResponse | ErrorResponse> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}

	try {
		const { data } = await apiClient.post(
			"/quit-game",
			{ sessionId },
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			},
		);

		const parsed = QuitGameResponseSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { ...parsed.data } as QuitGameResponse;
	} catch (error) {
		console.error("Quit game API error:", error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const statusText = error.response?.statusText ?? "";
			const text =
				typeof error.response?.data === "string" ? error.response.data : "";
			return {
				success: false,
				error: `Quit game failed: ${status} ${statusText} ${text}`,
			};
		}

		return { success: false, error: "Failed to quit game" };
	}
}

export async function undoMove(
	sessionId: string,
	idToken: string,
): Promise<UndoMoveResult> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}

	try {
		const { data } = await apiClient.post(
			"/undo-move",
			{ sessionId },
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			},
		);

		const parsed = UndoMoveResponseSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data };
	} catch (error) {
		console.error("Undo move API error:", error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const statusText = error.response?.statusText ?? "";
			const text =
				typeof error.response?.data === "string" ? error.response.data : "";
			return {
				success: false,
				error: `Undo move failed: ${status} ${statusText} ${text}`,
			};
		}

		return { success: false, error: "Failed to undo move" };
	}
}

export async function skipMove(
	sessionId: string,
	idToken: string,
): Promise<SkipMoveResult> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}

	try {
		const { data } = await apiClient.post(
			"/skip-move",
			{ sessionId },
			{
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			},
		);

		const parsed = SkipMoveResponseSchema.safeParse(data);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data };
	} catch (error) {
		console.error("Skip move API error:", error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status ?? "unknown";
			const statusText = error.response?.statusText ?? "";
			const text =
				typeof error.response?.data === "string" ? error.response.data : "";
			return {
				success: false,
				error: `Skip move failed: ${status} ${statusText} ${text}`,
			};
		}

		return { success: false, error: "Failed to skip move" };
	}
}
