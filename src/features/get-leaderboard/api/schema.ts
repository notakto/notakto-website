import { z } from "zod";

export const LeaderboardEntrySchema = z.object({
	rank: z.number(),
	username: z.string(),
	xp: z.number(),
});

export const CurrentUserSchema = z.object({
	rank: z.number(),
	username: z.string(),
	xp: z.number(),
});

export const LeaderBoardResponseSchema = z.object({
	leaderboard: z.array(LeaderboardEntrySchema),
	current_user: CurrentUserSchema,
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export type CurrentUser = z.infer<typeof CurrentUserSchema>;
export type LeaderBoardResponse = z.infer<typeof LeaderBoardResponseSchema>;
