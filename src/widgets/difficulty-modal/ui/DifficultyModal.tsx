"use client";
import type { DifficultyLevel } from "@/entities/game/model/types";
import { DifficultyActionButton } from "@/widgets/difficulty-action-button/ui/DifficultyActionButton";
import DifficultyContainer from "@/widgets/difficulty-container/ui/DifficultyContainer";
import DifficultyOptionList from "@/widgets/difficulty-option-list/ui/DifficultyOptionList";
import DifficultyTitle from "@/widgets/difficulty-title/ui/DifficultyTitle";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";

interface DifficultyModalProps {
	visible: boolean;
	onClose?: () => void;
	onSelect: (level: DifficultyLevel) => void;
}

const DifficultyModal = ({
	visible,
	onSelect,
	onClose,
}: DifficultyModalProps) => {
	if (!visible) return null;
	const DifficultyLevels: DifficultyLevel[] = [1, 2, 3, 4, 5];
	return (
		<ModalOverlay>
			<DifficultyContainer>
				<DifficultyTitle text="Select Difficulty"></DifficultyTitle>

				<DifficultyOptionList levels={DifficultyLevels} onSelect={onSelect} />

				<DifficultyActionButton variant="cancel" onClick={onClose}>
					Cancel
				</DifficultyActionButton>
			</DifficultyContainer>
		</ModalOverlay>
	);
};

export default DifficultyModal;
