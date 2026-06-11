"use client";

import { useNavigateGameMode } from "@/features/navigate-game-mode/model/useNavigateGameMode";
import GameModeList from "@/widgets/game-mode-list/ui/GameModeList";
import HomeFooterHint from "@/widgets/home-footer-hint/ui/HomeFooterHint";
import { GAME_MODES } from "@/widgets/home-menu/constants";
import HomeMenuTitleBlock from "@/widgets/home-menu-title-block/ui/HomeMenuTitleBlock";
import { MenuLayout } from "@/widgets/menu-layout/ui/MenuLayout";

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
