import { z } from "zod";

export const CreateGameResponseSchema = z.object({
	sessionId: z.string(),
	uid: z.string(),
	boards: z.array(z.number().int()),
	isAiMove: z.array(z.boolean()).optional(),
	winner: z.boolean(),
	boardSize: z.number().int(),
	numberOfBoards: z.number().int(),
	difficulty: z.number().int(),
	gameover: z.boolean(),
	createdAt: z.string(),
});

export const MakeMoveResponseSchema = z.object({
	boards: z.array(z.number().int()),
	isAiMove: z.array(z.boolean()).optional(),
	gameover: z.boolean(),
	winner: z.boolean(),
	coinsRewarded: z.number().int(),
	xpRewarded: z.number().int(),
});

export type MakeMoveResponse = z.infer<typeof MakeMoveResponseSchema>;

export const QuitGameResponseSchema = z.object({
	success: z.boolean(),
	error: z.string().optional(),
});

export const SkipMoveResponseSchema = z.object({
	boards: z.array(z.number().int()),
	isAiMove: z.array(z.boolean()).optional(),
	gameover: z.boolean(),
	winner: z.boolean(),
	coinsRewarded: z.number().int(),
	xpRewarded: z.number().int(),
});

export type SkipMoveResponse = z.infer<typeof SkipMoveResponseSchema>;

export const UndoMoveResponseSchema = z.object({
	boards: z.array(z.number().int()),
	isAiMove: z.array(z.boolean()).optional(),
});

export type UndoMoveResponse = z.infer<typeof UndoMoveResponseSchema>;
