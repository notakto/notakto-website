import { ZodError } from "zod";
import {
	CreateGameResponseSchema,
	type SignInResponse,
	SignInResponseSchema,
} from "@/services/schema";
import type {
	BoardSize,
	BoardState,
	DifficultyLevel,
	ErrorResponse,
	MakeMoveResponse,
	NewGameResponse,
	ResetGameResponse,
	SkipMoveResponse,
	UndoMoveResponse,
	UpdateConfigResponse,
} from "@/services/types";
import { NormalizeApiError } from "@/utils/apiError";

const API_BASE = "/api/game";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function signIn(idToken: string): Promise<SignInResponse> {
	if (!API_URL) {
		throw new Error("API configuration error");
	}
	const res = await fetch(`${API_URL}/sign-in`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!res.ok) {
		throw new Error("Sign-in failed. Please try again.");
	}

	const json = await res.json();

	try {
		return SignInResponseSchema.parse(json);
	} catch (err) {
		if (err instanceof ZodError) {
			throw new Error("Invalid response format from server");
		}
		throw err;
	}
}

export async function createGame(
	numberOfBoards: number,
	boardSize: BoardSize,
	difficulty: DifficultyLevel,
	idToken: string,
): Promise<NewGameResponse | ErrorResponse> {
	if (!API_URL) {
		return { success: false, error: "API configuration error" };
	}
	try {
		const response = await fetch(`${API_URL}/create-game`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({ numberOfBoards, boardSize, difficulty }),
		});
		if (!response.ok) {
			return { success: false, error: "Unable to create game" };
		}
		const json = await response.json();

		const parsed = CreateGameResponseSchema.safeParse(json);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data } as NewGameResponse;
	} catch (error) {
		return NormalizeApiError(error, "Failed to create game");
	}
}
export async function createSession(
	sessionId: string,
	boards: BoardState[],
	numberOfBoards: number,
	boardSize: BoardSize,
	difficulty: DifficultyLevel,
	idToken: string,
): Promise<NewGameResponse | ErrorResponse> {
	try {
		const response = await fetch(`${API_BASE}/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({
				sessionId,
				boards,
				numberOfBoards,
				boardSize,
				difficulty,
			}),
		});
		return await response.json();
	} catch (error) {
		return NormalizeApiError(error, "Failed to create game");
	}
}

export async function makeMove(
	sessionId: string,
	boardIndex: number,
	cellIndex: number,
	idToken: string,
): Promise<MakeMoveResponse | ErrorResponse> {
	try {
		const response = await fetch(`${API_BASE}/move`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({ sessionId, boardIndex, cellIndex }),
		});
		return await response.json();
	} catch (error) {
		return NormalizeApiError(error, "Failed to make move");
	}
}

export async function resetGame(
	sessionId: string,
	idToken: string,
): Promise<ResetGameResponse | ErrorResponse> {
	try {
		const response = await fetch(`${API_BASE}/reset`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({ sessionId }),
		});
		return await response.json();
	} catch (error) {
		return NormalizeApiError(error, "Failed to reset game");
	}
}

export async function updateConfig(
	sessionId: string,
	numberOfBoards: number,
	boardSize: BoardSize,
	difficulty: DifficultyLevel,
	idToken: string,
): Promise<UpdateConfigResponse | ErrorResponse> {
	try {
		const response = await fetch(`${API_BASE}/config`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({
				sessionId,
				numberOfBoards,
				boardSize,
				difficulty,
			}),
		});
		return await response.json();
	} catch (error) {
		return NormalizeApiError(error, "Failed to update configuration");
	}
}

export async function undoMove(
	sessionId: string,
	idToken: string,
): Promise<UndoMoveResponse | ErrorResponse> {
	try {
		const response = await fetch(`${API_BASE}/undo`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({ sessionId }),
		});
		return await response.json();
	} catch (error) {
		return NormalizeApiError(error, "Failed to undo move");
	}
}

export async function skipMove(
	sessionId: string,
	idToken: string,
): Promise<SkipMoveResponse | ErrorResponse> {
	try {
		const response = await fetch(`${API_BASE}/skip`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({ sessionId }),
		});
		return await response.json();
	} catch (error) {
		return NormalizeApiError(error, "Failed to skip move");
	}
}
