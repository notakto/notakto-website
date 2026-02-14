export const pageShortcuts: Record<string, { key: string; action: string }[]> =
	{
		"/": [
			{ key: "Esc", action: "actions.close_modal" },
			{ key: "Q", action: "actions.open_shortcuts" },
			{ key: "T", action: "actions.open_tutorial" },
			{ key: "S", action: "actions.adjust_sound" },
		],
		"/vsPlayer": [
			{ key: "Esc", action: "actions.close_modal" },
			{ key: "M", action: "actions.go_main_menu" },
			{ key: "R", action: "actions.reset_game" },
			{ key: "C", action: "actions.open_config" },
			{ key: "N", action: "actions.toggle_names" },
			{ key: "S", action: "actions.adjust_sound" },
			{ key: "Q", action: "actions.open_shortcuts" },
		],
		"/vsComputer": [
			{ key: "Esc", action: "actions.close_modal" },
			{ key: "M", action: "actions.go_main_menu" },
			{ key: "R", action: "actions.reset_game" },
			{ key: "C", action: "actions.open_config" },
			{ key: "S", action: "actions.adjust_sound" },
			{ key: "D", action: "actions.open_difficulty" },
			{ key: "Q", action: "actions.open_shortcuts" },
		],
	};
