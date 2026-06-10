import type {
	MakeMoveResponse,
	SkipMoveResponse,
	UndoMoveResponse,
} from "@/entities/game/api/schema";

// CORE GAME TYPES

export type BoardState = Array<string>;
export type GameMode = "vsComputer" | "vsPlayer" | "liveMatch" | null;
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type BoardSize = 2 | 3 | 4 | 5;
export type BoardNumber = 1 | 2 | 3 | 4 | 5;

export interface MoveLogEntry {
	player: 1 | 2;
	board: number;
	cell: number;
}

// API RESPONSE INTERFACES

export interface ErrorResponse {
	success: false;
	error: string;
}

export interface NewGameResponse {
	success: true;
	sessionId: string;
	uid: string;
	boards: number[];
	isAiMove?: boolean[];
	winner: boolean;
	boardSize: BoardSize;
	numberOfBoards: BoardNumber;
	difficulty: DifficultyLevel;
	gameover: boolean;
	createdAt: string;
}
export type MakeMoveResult =
	| ({ success: true } & MakeMoveResponse)
	| ErrorResponse;
export type SkipMoveResult =
	| ({ success: true } & SkipMoveResponse)
	| ErrorResponse;
export type UndoMoveResult =
	| ({ success: true } & UndoMoveResponse)
	| ErrorResponse;

export interface QuitGameResponse {
	success: boolean;
	error?: string;
}
