"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { PlayerStartButton } from "@/components/ui/Buttons/PlayerStartButton";
import PlayerNameFormContainer from "@/components/ui/Containers/PlayerNameModal/PlayerNameFormContainer";
import PlayerNameModalContainer from "@/components/ui/Containers/PlayerNameModal/PlayerNameModalContainer";
import { PlayerInput } from "@/components/ui/Inputs/PlayerInput";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import PlayerNameModalTitle from "@/components/ui/Title/PlayerNameModalTitle";
import { TOAST_DURATION, TOAST_IDS } from "@/constants/toast";
import type { PlayerNamesModalProps } from "@/services/types";

const MAX_PLAYER_NAME_LENGTH = 15;

const PlayerNamesModal = ({
	visible,
	onSubmit,
	initialNames = ["Player 1", "Player 2"],
}: PlayerNamesModalProps) => {
	const t = useTranslations("PlayerNamesModal");
	const [player1, setPlayer1] = useState(initialNames[0] || t("player_1"));
	const [player2, setPlayer2] = useState(initialNames[1] || t("player_2"));

	const { canShowToast, triggerToastCooldown, resetCooldown } =
		useToastCooldown(TOAST_DURATION);

	useEffect(() => {
		setPlayer1(initialNames[0] || t("player_1"));
		setPlayer2(initialNames[1] || t("player_2"));
	}, [initialNames, t]);

	const handleSubmit = () => {
		if (!canShowToast()) return;

		if (player1.trim().toLowerCase() === player2.trim().toLowerCase()) {
			toast(t("duplicate_names_error"), {
				toastId: TOAST_IDS.PlayerNames.Duplicate,
				autoClose: TOAST_DURATION,
				onClose: resetCooldown, // reset cooldown if closed early
			});
			triggerToastCooldown();
			return;
		}
		toast.dismiss(TOAST_IDS.PlayerNames.Duplicate);
		resetCooldown();

		onSubmit(player1 || t("player_1"), player2 || t("player_2"));
	};

	if (!visible) return null;

	return (
		<ModalOverlay>
			<PlayerNameModalContainer>
				<PlayerNameModalTitle text={t("title")} />
				<PlayerNameFormContainer>
					<div>
						<PlayerInput
							value={player1}
							onChange={(e) => setPlayer1(e.target.value)}
							placeholder={t("player_1_name")}
							maxLength={MAX_PLAYER_NAME_LENGTH}
						/>
						{/* ✅ Character counter - right aligned */}
						<div className="text-xl text-white mt-1 text-right">
							{player1.length}/{MAX_PLAYER_NAME_LENGTH} {t("characters")}
						</div>
					</div>

					<div>
						<PlayerInput
							value={player2}
							onChange={(e) => setPlayer2(e.target.value)}
							placeholder={t("player_2_name")}
							maxLength={MAX_PLAYER_NAME_LENGTH}
						/>
						{/* ✅ Character counter - right aligned */}
						<div className="text-xl text-white mt-1 text-right">
							{player2.length}/{MAX_PLAYER_NAME_LENGTH} {t("characters")}
						</div>
					</div>
				</PlayerNameFormContainer>

				<PlayerStartButton onClick={handleSubmit}>
					{t("start_game")}
				</PlayerStartButton>
			</PlayerNameModalContainer>
		</ModalOverlay>
	);
};

export default PlayerNamesModal;
