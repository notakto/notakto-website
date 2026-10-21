import { z } from "zod";

export const LeaderboardEntrySchema = z.object({
	rank: z.number(),
	username: z.string(),
	xp: z.number(),
});

export const LeaderBoardResponseSchema = z.object({
	leaderboard: z.array(LeaderboardEntrySchema),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;

export type LeaderBoardResponse = z.infer<typeof LeaderBoardResponseSchema>;
