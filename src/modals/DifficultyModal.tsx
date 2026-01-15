"use client";
import { useTranslations } from "next-intl";
import { DifficultyActionButton } from "@/components/ui/Buttons/DifficultyActionButton";
import DifficultyContainer from "@/components/ui/Containers/Difficulty/DifficultyContainer";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import DifficultyTitle from "@/components/ui/Title/DifficultyTitle";
import type { DifficultyLevel, DifficultyModalProps } from "@/services/types";

const DifficultyModal = ({
	visible,
	onSelect,
	onClose,
}: DifficultyModalProps) => {
	const t = useTranslations("DifficultyModal");
	if (!visible) return null;
	const DifficultyLevels: DifficultyLevel[] = [1, 2, 3, 4, 5];
	return (
		<ModalOverlay>
			<DifficultyContainer>
				<DifficultyTitle text={t("select_difficulty")}></DifficultyTitle>

				{DifficultyLevels.map((level) => (
					<DifficultyActionButton
						variant="level"
						key={level}
						onClick={() => onSelect(level)}>
						{t("level", { level })}
					</DifficultyActionButton>
				))}

				<DifficultyActionButton variant="cancel" onClick={onClose}>
					{t("cancel")}
				</DifficultyActionButton>
			</DifficultyContainer>
		</ModalOverlay>
	);
};

export default DifficultyModal;
