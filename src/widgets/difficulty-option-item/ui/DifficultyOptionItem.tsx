import type { DifficultyLevel } from "@/entities/game/model/types";
import { DifficultyActionButton } from "@/widgets/difficulty-action-button/ui/DifficultyActionButton";

interface DifficultyOptionItemProps {
	level: DifficultyLevel;
	onSelect: (level: DifficultyLevel) => void;
}

export default function DifficultyOptionItem({
	level,
	onSelect,
}: DifficultyOptionItemProps) {
	return (
		<DifficultyActionButton variant="level" onClick={() => onSelect(level)}>
			Level {level}
		</DifficultyActionButton>
	);
}
