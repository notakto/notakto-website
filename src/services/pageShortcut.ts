export const pageShortcuts: Record<string, { key: string; action: string }[]> =
	{
		"/": [
			{ key: "Esc", action: "Close the modal" },
			{ key: "Q", action: "Open keyboard shortcuts" },
			{ key: "T", action: "Open tutorial" },
			{ key: "S", action: "Adjust sound" },
		],
		"/vsPlayer": [
			{ key: "Esc", action: "Close the modal" },
			{ key: "M", action: "Go to main menu" },
			{ key: "R", action: "Reset the game" },
			{ key: "C", action: "Open game configuration" },
			{ key: "N", action: "Toggle player names" },
			{ key: "S", action: "Adjust sound" },
			{ key: "Q", action: "Open keyboard shortcuts" },
		],
		"/vsComputer": [
			{ key: "Esc", action: "Close the modal" },
			{ key: "M", action: "Go to main menu" },
			{ key: "R", action: "Reset the game" },
			{ key: "C", action: "Open game configuration" },
			{ key: "S", action: "Adjust sound" },
			{ key: "D", action: "Open difficulty level" },
			{ key: "Q", action: "Open keyboard shortcuts" },
		],
	};
