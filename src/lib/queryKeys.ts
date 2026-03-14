export const queryKeys = {
	// User profile keys
	user: (userId: string) => ["user", userId] as const,
	userAll: () => ["user"] as const,

	// Game session keys
	game: (sessionId: string) => ["game", sessionId] as const,
	gameAll: () => ["game"] as const,

	// Game history keys
	gameHistory: (userId: string) => ["gameHistory", userId] as const,
	gameHistoryAll: () => ["gameHistory"] as const,
};
