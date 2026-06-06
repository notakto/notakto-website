"use client";

import type { GameMode } from "@/entities/game/model/types";
import { useNavigateGameMode } from "@/features/navigate-game-mode/model/useNavigateGameMode";
import GameModeList from "@/widgets/game-mode-list/ui/GameModeList";
import HomeFooterHint from "@/widgets/home-footer-hint/ui/HomeFooterHint";
import HomeMenuTitleBlock from "@/widgets/home-menu-title-block/ui/HomeMenuTitleBlock";
import { MenuLayout } from "@/widgets/menu-layout/ui/MenuLayout";

const GAME_MODES: {
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

const Menu = () => {
	const startGame = useNavigateGameMode();

	return (
		<MenuLayout>
			<div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
				<HomeMenuTitleBlock />
				<GameModeList modes={GAME_MODES} onSelect={startGame} />
				<HomeFooterHint />
			</div>
		</MenuLayout>
	);
};

export default Menu;
