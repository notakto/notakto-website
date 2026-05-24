"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
	TOAST_DURATION,
	TOAST_IDS,
} from "@/features/show-toast-with-cooldown/model/toast";
import { useToastCooldown } from "@/features/show-toast-with-cooldown/model/useToastCooldown";
import ModalOverlay from "@/shared/ui/overlays/ModalOverlay";
import { PlayerStartButton } from "@/widgets/modals/ui/buttons/PlayerStartButton";
import PlayerNameFormContainer from "@/widgets/modals/ui/containers/PlayerNameModal/PlayerNameFormContainer";
import PlayerNameModalContainer from "@/widgets/modals/ui/containers/PlayerNameModal/PlayerNameModalContainer";
import { PlayerInput } from "@/widgets/modals/ui/inputs/PlayerInput";
import PlayerNameModalTitle from "@/widgets/modals/ui/title/PlayerNameModalTitle";
import type { PlayerNamesModalProps } from "@/widgets/ui/types";

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
					<div>
						<PlayerInput
							value={player1}
							onChange={(e) => setPlayer1(e.target.value)}
							placeholder="Player 1 Name"
							maxLength={MAX_PLAYER_NAME_LENGTH}
						/>
						<div className="text-[8px] text-cream-dim font-pixel mt-1 text-right">
							{player1.length}/{MAX_PLAYER_NAME_LENGTH}
						</div>
					</div>

					<div>
						<PlayerInput
							value={player2}
							onChange={(e) => setPlayer2(e.target.value)}
							placeholder="Player 2 Name"
							maxLength={MAX_PLAYER_NAME_LENGTH}
						/>
						<div className="text-[8px] text-cream-dim font-pixel mt-1 text-right">
							{player2.length}/{MAX_PLAYER_NAME_LENGTH}
						</div>
					</div>
				</PlayerNameFormContainer>

				<div className="flex justify-center gap-4">
					<PlayerStartButton onClick={handleSubmit}>
						Start Game
					</PlayerStartButton>
					{onClose && (
						<button
							type="button"
							onClick={onClose}
							className="bg-bg2 hover:bg-bg3 text-cream text-[10px] font-pixel uppercase tracking-wider w-full py-3 border-3 border-border-pixel shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer">
							Cancel
						</button>
					)}
				</div>
			</PlayerNameModalContainer>
		</ModalOverlay>
	);
};

export default PlayerNamesModal;
