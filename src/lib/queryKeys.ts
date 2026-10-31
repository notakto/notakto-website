export const queryKeys = {
	user: (userId: string) => ["user", userId] as const,

	game: (sessionId: string) => ["game", sessionId] as const,

	gameHistory: (userId: string) => ["gameHistory", userId] as const,

	leaderboard: () => ["leaderboard"] as const,
};
