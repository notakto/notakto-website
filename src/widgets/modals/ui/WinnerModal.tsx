import { WinnerButton } from "@/widgets/modals/ui/buttons/WinnerButton";
import WinnerAction from "@/widgets/modals/ui/containers/WinnerModal/WinnerAction";
import WinnerContainer from "@/widgets/modals/ui/containers/WinnerModal/WinnerContainer";
import ModalOverlay from "@/widgets/modals/ui/ModalOverlay";
import WinnerMessage from "@/widgets/modals/ui/title/WinnerMessage";
import WinnerTitle from "@/widgets/modals/ui/title/WinnerTitle";
import type { WinnerModalProps } from "@/widgets/ui/types";

const WinnerModal = ({
	visible,
	winner,
	onPlayAgain,
	onMenu,
}: WinnerModalProps) => {
	if (!visible) return null;
	return (
		<ModalOverlay>
			<WinnerContainer>
				<WinnerTitle text="Game Over!" />
				<WinnerMessage
					text={winner === "You" ? "You won!" : `${winner} wins`}
				/>
				<WinnerAction>
					<WinnerButton onClick={onPlayAgain}>Play Again</WinnerButton>
					<WinnerButton onClick={onMenu}>Main Menu</WinnerButton>
				</WinnerAction>
			</WinnerContainer>
		</ModalOverlay>
	);
};

export default WinnerModal;
