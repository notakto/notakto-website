"use client";

import { useTranslations } from "next-intl";
import { WinnerButton } from "@/components/ui/Buttons/WinnerButton";
import WinnerAction from "@/components/ui/Containers/WinnerModal/WinnerAction";
import WinnerContainer from "@/components/ui/Containers/WinnerModal/WinnerContainer";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import WinnerMessage from "@/components/ui/Title/WinnerMessage";
import WinnerTitle from "@/components/ui/Title/WinnerTitle";
import type { WinnerModalProps } from "@/services/types";

const WinnerModal = ({
	visible,
	winner,
	onPlayAgain,
	onMenu,
}: WinnerModalProps) => {
	const t = useTranslations("WinnerModal");
	if (!visible) return null;
	return (
		<ModalOverlay>
			<WinnerContainer>
				<WinnerTitle text={t("game_over")} />
				<WinnerMessage
					text={winner === "You" ? t("you_won") : t("wins", { name: winner })}
				/>
				<WinnerAction>
					<WinnerButton onClick={onPlayAgain}>{t("play_again")}</WinnerButton>
					<WinnerButton onClick={onMenu}>{t("main_menu")}</WinnerButton>
				</WinnerAction>
			</WinnerContainer>
		</ModalOverlay>
	);
};

export default WinnerModal;
