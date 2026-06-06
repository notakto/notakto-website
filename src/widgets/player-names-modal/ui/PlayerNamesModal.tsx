"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
	TOAST_DURATION,
	TOAST_IDS,
} from "@/features/show-toast-with-cooldown/model/toast";
import { useToastCooldown } from "@/features/show-toast-with-cooldown/model/useToastCooldown";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import PlayerNameField from "@/widgets/player-name-field/ui/PlayerNameField";
import PlayerNameFormContainer from "@/widgets/player-name-form-container/ui/PlayerNameFormContainer";
import PlayerNameModalContainer from "@/widgets/player-name-modal-container/ui/PlayerNameModalContainer";
import PlayerNameModalTitle from "@/widgets/player-name-modal-title/ui/PlayerNameModalTitle";
import PlayerNamesActionRow from "@/widgets/player-names-action-row/ui/PlayerNamesActionRow";
export interface PlayerNamesModalProps {
	visible: boolean;
	onClose?: () => void;
	onSubmit: (p1: string, p2: string) => void;
	initialNames?: [string, string];
}

const MAX_PLAYER_NAME_LENGTH = 15;

const PlayerNamesModal = ({
	visible,
	onSubmit,
	onClose,
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
					<PlayerNameField
						value={player1}
						onChange={(e) => setPlayer1(e.target.value)}
						placeholder="Player 1 Name"
						maxLength={MAX_PLAYER_NAME_LENGTH}
					/>

					<PlayerNameField
						value={player2}
						onChange={(e) => setPlayer2(e.target.value)}
						placeholder="Player 2 Name"
						maxLength={MAX_PLAYER_NAME_LENGTH}
					/>
				</PlayerNameFormContainer>

				<PlayerNamesActionRow onStart={handleSubmit} onCancel={onClose} />
			</PlayerNameModalContainer>
		</ModalOverlay>
	);
};

export default PlayerNamesModal;
