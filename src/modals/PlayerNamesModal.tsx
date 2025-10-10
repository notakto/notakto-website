"use client";
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

const PlayerNamesModal = ({
	visible,
	onSubmit,
	initialNames = ["Player 1", "Player 2"],
}: PlayerNamesModalProps) => {
	const [player1, setPlayer1] = useState(initialNames[0] || "Player 1");
	const [player2, setPlayer2] = useState(initialNames[1] || "Player 2");

	const { canShowToast, triggerToastCooldown, resetCooldown } =
		useToastCooldown(TOAST_DURATION);

	useEffect(() => {
		setPlayer1(initialNames[0] || "Player 1");
		setPlayer2(initialNames[1] || "Player 2");
	}, [initialNames]);

	const handleSubmit = () => {
		if (!canShowToast()) return;

		if (player1.trim().toLowerCase() === player2.trim().toLowerCase()) {
			toast("Player 1 and Player 2 cannot have the same name.", {
				toastId: TOAST_IDS.PlayerNames.Duplicate,
				autoClose: TOAST_DURATION,
				onClose: resetCooldown, // reset cooldown if closed early
			});
			triggerToastCooldown();
			return;
		}
		toast.dismiss(TOAST_IDS.PlayerNames.Duplicate);
		resetCooldown();

		onSubmit(player1 || "Player 1", player2 || "Player 2");
	};

	if (!visible) return null;

	return (
		<ModalOverlay>
			<PlayerNameModalContainer>
				<PlayerNameModalTitle text="Enter Player Names" />
				<PlayerNameFormContainer>
					<PlayerInput
						value={player1}
						onChange={(e) => setPlayer1(e.target.value)}
						placeholder="Player 1 Name"
					/>

					<PlayerInput
						value={player2}
						onChange={(e) => setPlayer2(e.target.value)}
						placeholder="Player 2 Name"
					/>
				</PlayerNameFormContainer>

				<PlayerStartButton onClick={handleSubmit}>Start Game</PlayerStartButton>
			</PlayerNameModalContainer>
		</ModalOverlay>
	);
};

export default PlayerNamesModal;
