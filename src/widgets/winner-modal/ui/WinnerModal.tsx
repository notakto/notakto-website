import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import WinnerAction from "@/widgets/winner-action/ui/WinnerAction";
import { WinnerButton } from "@/widgets/winner-button/ui/WinnerButton";
import WinnerContainer from "@/widgets/winner-container/ui/WinnerContainer";
import WinnerMessage from "@/widgets/winner-message/ui/WinnerMessage";
import WinnerTitle from "@/widgets/winner-title/ui/WinnerTitle";

interface WinnerModalProps {
	visible: boolean;
	onClose?: () => void;
	winner: string;
	onPlayAgain: () => void;
	onMenu: () => void;
}

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
