// This file contains all shared types and interfaces used across the application
// Using TypeScript utility types to reduce duplication and improve maintainability

import type { User } from "firebase/auth";
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

// ZUSTAND STORE TYPES

export interface SoundStore {
	bgMute: boolean;
	bgVolume: number;
	sfxMute: boolean;
	sfxVolume: number;
	setBgMute: (mute: boolean) => void;
	setBgVolume: (vol: number) => void;
	setSfxMute: (mute: boolean) => void;
	setSfxVolume: (vol: number) => void;
}
export interface ProfileStore {
	name: string;
	email: string;
	pic: string;
	setName: (name: string) => void;
	setEmail: (email: string) => void;
	setPic: (pic: string) => void;
}

export interface UserStore {
	user: User | null;
	authReady: boolean;
	setUser: (newUser: User | null) => void;
	setAuthReady: (v: boolean) => void;
}

export interface CoinStore {
	coins: number;
	setCoins: (newCoins: number) => void;
	optimisticAddCoins: (amount: number) => void;
}

export interface XPStore {
	XP: number;
	setXP: (newXP: number) => void;
	optimisticAddXP: (amount: number) => void;
}
