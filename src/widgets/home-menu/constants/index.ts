import type { GameMode } from "@/entities/game/model/types";

export const GAME_MODES: {
	mode: Exclude<GameMode, null>;
	title: string;
	description: string;
	icon: string;
	requiresAuth: boolean;
}[] = [
	{
		mode: "vsPlayer",
		title: "VS PLAYER",
		description: "CHALLENGE A FRIEND ON THE SAME DEVICE",
		icon: "+",
		requiresAuth: false,
	},
	{
		mode: "vsComputer",
		title: "VS CPU",
		description: "TEST YOUR SKILLS AGAINST THE AI",
		icon: ">",
		requiresAuth: true,
	},
	{
		mode: "liveMatch",
		title: "LIVE MATCH",
		description: "PLAY AGAINST OPPONENTS ONLINE",
		icon: "#",
		requiresAuth: true,
	},
];
