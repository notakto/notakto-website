import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import { TutorialButton } from "@/widgets/tutorial-button/ui/TutorialButton";
import TutorialContainer from "@/widgets/tutorial-container/ui/TutorialContainer";
import TutorialList from "@/widgets/tutorial-list/ui/TutorialList";
import TutorialTitle from "@/widgets/tutorial-title/ui/TutorialTitle";

interface TutorialModalProps {
	visible: boolean;
	onClose?: () => void;
}

const TutorialModal = ({ visible, onClose }: TutorialModalProps) => {
	if (!visible) return null;
	const rules = [
		"Both players use X marks",
		"Game is played on three 3x3 boards",
		"Players alternate placing Xs",
		"Any board with 3 Xs in a row becomes dead",
		"Last player to make a valid move loses",
		"Strategy: Force opponent to make final move!",
	];

	return (
		<ModalOverlay>
			<TutorialContainer>
				<TutorialTitle text="How&nbsp;to&nbsp;Play&nbsp;Notakto" />

				<TutorialList items={rules} />

				<TutorialButton onClick={onClose}>Close&nbsp;Tutorial</TutorialButton>
			</TutorialContainer>
		</ModalOverlay>
	);
};

export default TutorialModal;
