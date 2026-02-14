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

const MAX_PLAYER_NAME_LENGTH = 15;

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
		const trimmedPlayer1 = player1.trim();
		const trimmedPlayer2 = player2.trim();

		// Empty name validation
		if (!trimmedPlayer1 || !trimmedPlayer2) {
			if (canShowToast()) {
				toast("Player name cannot be empty.", {
					toastId: TOAST_IDS.PlayerNames.Empty,
					autoClose: TOAST_DURATION,
					onClose: resetCooldown,
				});
				triggerToastCooldown();
			}

			const finalPlayer1 = trimmedPlayer1 || "Player 1";
			const finalPlayer2 = trimmedPlayer2 || "Player 2";

			setPlayer1(finalPlayer1);
			setPlayer2(finalPlayer2);

			// Run duplicate validation on final autofilled names
			if (finalPlayer1.toLowerCase() === finalPlayer2.toLowerCase()) {
				if (canShowToast()) {
					toast("Player 1 and Player 2 cannot have the same name.", {
						toastId: TOAST_IDS.PlayerNames.Duplicate,
						autoClose: TOAST_DURATION,
						onClose: resetCooldown,
					});
					triggerToastCooldown();
				}
				return;
			}

			onSubmit(finalPlayer1, finalPlayer2);
			return;
		}

		// Duplicate name validation
		if (trimmedPlayer1.toLowerCase() === trimmedPlayer2.toLowerCase()) {
			if (canShowToast()) {
				toast("Player 1 and Player 2 cannot have the same name.", {
					toastId: TOAST_IDS.PlayerNames.Duplicate,
					autoClose: TOAST_DURATION,
					onClose: resetCooldown,
				});
				triggerToastCooldown();
			}
			return;
		}

		toast.dismiss(TOAST_IDS.PlayerNames.Duplicate);
		toast.dismiss(TOAST_IDS.PlayerNames.Empty);
		resetCooldown();

		onSubmit(trimmedPlayer1, trimmedPlayer2);
	};

	if (!visible) return null;

	return (
		<ModalOverlay>
			<PlayerNameModalContainer>
				<PlayerNameModalTitle text="Enter Player Names" />
				<PlayerNameFormContainer>
					<div>
						<PlayerInput
							value={player1}
							onChange={(e) => setPlayer1(e.target.value)}
							placeholder="Player 1 Name"
							maxLength={MAX_PLAYER_NAME_LENGTH}
						/>
						{/* ✅ Character counter - right aligned */}
						<div className="text-xl text-white mt-1 text-right">
							{player1.length}/{MAX_PLAYER_NAME_LENGTH} characters
						</div>
					</div>

					<div>
						<PlayerInput
							value={player2}
							onChange={(e) => setPlayer2(e.target.value)}
							placeholder="Player 2 Name"
							maxLength={MAX_PLAYER_NAME_LENGTH}
						/>
						{/* ✅ Character counter - right aligned */}
						<div className="text-xl text-white mt-1 text-right">
							{player2.length}/{MAX_PLAYER_NAME_LENGTH} characters
						</div>
					</div>
				</PlayerNameFormContainer>

				<PlayerStartButton onClick={handleSubmit}>Start Game</PlayerStartButton>
			</PlayerNameModalContainer>
		</ModalOverlay>
	);
};

export default PlayerNamesModal;
