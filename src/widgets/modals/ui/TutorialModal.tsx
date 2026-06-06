import { TutorialButton } from "@/widgets/modals/ui/buttons/TutorialButton";
import TutorialContainer from "@/widgets/modals/ui/containers/Tutorial/TutorialContainer";
import TutorialList from "@/widgets/modals/ui/list/TutorialList";
import ModalOverlay from "@/widgets/modals/ui/ModalOverlay";
import TutorialTitle from "@/widgets/modals/ui/title/TutorialTitle";
import type { TutorialModalProps } from "@/widgets/types";

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
