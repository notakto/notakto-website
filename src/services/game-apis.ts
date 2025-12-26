import { ZodError, z } from "zod";
import {
	CreateGameResponseSchema,
	type GetWalletResponse,
	GetWalletResponseSchema,
	MakeMoveResponseSchema,
	QuitGameResponseSchema,
	type SignInResponse,
	SignInResponseSchema,
	SkipMoveResponseSchema,
} from "@/services/schema";
import type {
	BoardSize,
	BoardState,
	DifficultyLevel,
	ErrorResponse,
	MakeMoveResult,
	NewGameResponse,
	QuitGameResponse,
	SkipMoveResult,
	UndoMoveResponse,
} from "@/services/types";

const API_BASE = "/api/game";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function signIn(idToken: string): Promise<SignInResponse> {
	if (!API_URL) {
		throw new Error("API URL is not defined");
	}
	const res = await fetch(`${API_URL}/sign-in`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${idToken}`,
		},
	});

	if (!res.ok) {
		let details = "";
		try {
			const errJson = await res.json();
			details = errJson.message ?? JSON.stringify(errJson);
		} catch {
			details = await res.text();
		}
		throw new Error(`Sign-in failed (${res.status}): ${details}`);
	}

	const json = await res.json();

	try {
		const data = SignInResponseSchema.parse(json);
		return data;
	} catch (err) {
		if (err instanceof ZodError) {
			const tree = z.treeifyError(err);
			console.error("Zod validation errors:", tree);
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
		return { success: false, error: "API_URL not defined" };
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
			const text = await response.text().catch(() => "");
			return {
				success: false,
				error: `Create game failed: ${response.status} ${response.statusText} ${text}`,
			};
		}
		const json = await response.json();

		const parsed = CreateGameResponseSchema.safeParse(json);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data } as NewGameResponse;
	} catch (error) {
		console.error("Create game API error:", error);
		return { success: false, error: "Failed to create game" };
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
		console.error("Create game API error:", error);
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
		const response = await fetch(`${API_URL}/make-move`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({ sessionId, boardIndex, cellIndex }),
		});
		if (!response.ok) {
			const text = await response.text().catch(() => "");
			return {
				success: false,
				error: `Make move failed: ${response.status} ${response.statusText} ${text}`,
			};
		}
		const json = await response.json();

		const parsed = MakeMoveResponseSchema.safeParse(json);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data };
	} catch (error) {
		console.error("Make move API error:", error);
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
		const response = await fetch(`${API_URL}/quit-game`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({ sessionId }),
		});
		const json = await response.json();

		const parsed = QuitGameResponseSchema.safeParse(json);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { ...parsed.data } as QuitGameResponse;
	} catch (error) {
		console.error("Reset game API error:", error);
		return { success: false, error: "Failed to reset game" };
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
		console.error("Undo move API error:", error);
		return { success: false, error: "Failed to undo move" };
	}
}

export async function skipMove(
	sessionId: string,
	idToken: string,
): Promise<SkipMoveResult> {
	try {
		const response = await fetch(`${API_URL}/skip-move`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
			body: JSON.stringify({ sessionId }),
		});
		if (!response.ok) {
			const text = await response.text().catch(() => "");
			return {
				success: false,
				error: `Skip move failed: ${response.status} ${response.statusText} ${text}`,
			};
		}
		const json = await response.json();

		const parsed = SkipMoveResponseSchema.safeParse(json);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { success: true, ...parsed.data };
	} catch (error) {
		console.error("Skip move API error:", error);
		return { success: false, error: "Failed to skip move" };
	}
}
export async function getWallet(
	idToken: string,
): Promise<GetWalletResponse | ErrorResponse> {
	if (!API_URL) {
		return { success: false, error: "API_URL not defined" };
	}
	try {
		const response = await fetch(`${API_URL}/get-wallet`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${idToken}`,
			},
		});
		if (!response.ok) {
			const text = await response.text().catch(() => "");
			return {
				success: false,
				error: `get-wallet failed: ${response.status} ${response.statusText} ${text}`,
			};
		}
		const json = await response.json();

		const parsed = GetWalletResponseSchema.safeParse(json);
		if (!parsed.success) {
			return { success: false, error: "Invalid response format" };
		}

		return { ...parsed.data };
	} catch (error) {
		console.error(" error:", error);
		return { success: false, error: "Failed to make move" };
	}
}
