"use client";
import type { DifficultyLevel } from "@/entities/game/model/types";
import { DifficultyActionButton } from "@/widgets/modals/ui/buttons/DifficultyActionButton";
import DifficultyContainer from "@/widgets/modals/ui/containers/Difficulty/DifficultyContainer";
import ModalOverlay from "@/widgets/modals/ui/ModalOverlay";
import DifficultyTitle from "@/widgets/modals/ui/title/DifficultyTitle";
import type { DifficultyModalProps } from "@/widgets/ui/types";

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

				{DifficultyLevels.map((level) => (
					<DifficultyActionButton
						variant="level"
						key={level}
						onClick={() => onSelect(level)}>
						Level {level}
					</DifficultyActionButton>
				))}

				<DifficultyActionButton variant="cancel" onClick={onClose}>
					Cancel
				</DifficultyActionButton>
			</DifficultyContainer>
		</ModalOverlay>
	);
};

export default DifficultyModal;
