import { z } from "zod";

export const SignInResponseSchema = z.object({
	uid: z.string(),
	name: z.string(),
	email: z.email(),
	profile_pic: z.url(),
	new_account: z.boolean(),
});

export type SignInResponse = z.infer<typeof SignInResponseSchema>;

export const CreateGameResponseSchema = z.object({
	sessionId: z.string(),
	uid: z.string(),
	boards: z.array(z.number().int()),
	winner: z.boolean(),
	boardSize: z.number().int(),
	numberOfBoards: z.number().int(),
	difficulty: z.number().int(),
	gameover: z.boolean(),
	createdAt: z.string(),
});

export type CreateGameResponse = z.infer<typeof CreateGameResponseSchema>;

export const MakeMoveResponseSchema = z.object({
	boards: z.array(z.number().int()),
	gameover: z.boolean(),
	winner: z.boolean(),
	coinsRewarded: z.number().int(),
	xpRewarded: z.number().int(),
});

export type MakeMoveResponse = z.infer<typeof MakeMoveResponseSchema>;
