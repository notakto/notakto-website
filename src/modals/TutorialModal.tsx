import { TutorialButton } from "@/components/ui/Buttons/TutorialButton";
import TutorialContainer from "@/components/ui/Containers/Tutorial/TutorialContainer";
import TutorialList from "@/components/ui/List/TutorialList";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import TutorialTitle from "@/components/ui/Title/TutorialTitle";
import { useTut } from "@/services/store";

const TutorialModal = () => {
	const { showTut, setShowTut } = useTut();
	if (!showTut) return null;

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
				<TutorialTitle text="How&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;Play Notakto" />

				<TutorialList items={rules} />

				<TutorialButton onClick={() => setShowTut(false)}>
					Close&nbsp;&nbsp;&nbsp;Tutorial
				</TutorialButton>
			</TutorialContainer>
		</ModalOverlay>
	);
};

export default TutorialModal;
