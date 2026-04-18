export const TOAST_DURATION = 4000; // milliseconds

export const TOAST_IDS = {
	// User/Auth related toasts
	User: {
		SignInError: "auth/sign-in-error",
	},

	// Player name modal
	PlayerNames: {
		Duplicate: "player-names/duplicate",
	},

	// Payment related toasts
	Payment: {
		PopupBlocked: "payment/popup-blocked",
		Success: "payment/success",
		Failure: "payment/failure",
	},

	// Live match toasts
	LiveMatch: {
		OpponentDisconnected: "live-match/opponent-disconnected",
		GameOver: "live-match/game-over",
	},
} as const;
