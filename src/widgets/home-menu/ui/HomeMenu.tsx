"use client";

import { useGlobalModal } from "@/features/manage-global-modal/model/globalModalStore";
import { useNavigateGameMode } from "@/features/navigate-game-mode/model/useNavigateGameMode";
import { useShortcut } from "@/features/use-keyboard-shortcuts/model/useShortcut";
import GameModeList from "@/widgets/game-mode-list/ui/GameModeList";
import HomeFooterHint from "@/widgets/home-footer-hint/ui/HomeFooterHint";
import { GAME_MODES } from "@/widgets/home-menu/constants";
import HomeMenuTitleBlock from "@/widgets/home-menu-title-block/ui/HomeMenuTitleBlock";
import { MenuLayout } from "@/widgets/menu-layout/ui/MenuLayout";

const Menu = () => {
	const startGame = useNavigateGameMode();
	const { activeModal, openModal, closeModal } = useGlobalModal();
	useShortcut(
		{
			escape: () => {
				if (activeModal) return closeModal();
			},
			s: () => {
				activeModal === "soundConfig" ? closeModal() : openModal("soundConfig");
			},
			q: () => {
				activeModal === "shortcut" ? closeModal() : openModal("shortcut");
			},
			p: () => {
				activeModal === "profile" ? closeModal() : openModal("profile");
			},
			t: () => {
				activeModal === "tutorial" ? closeModal() : openModal("tutorial");
			},
		},
		false,
	);
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
