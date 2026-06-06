import type { DifficultyLevel } from "@/entities/game/model/types";
import DifficultyOptionItem from "@/widgets/difficulty-option-item/ui/DifficultyOptionItem";

interface DifficultyOptionListProps {
	levels: DifficultyLevel[];
	onSelect: (level: DifficultyLevel) => void;
}

export default function DifficultyOptionList({
	levels,
	onSelect,
}: DifficultyOptionListProps) {
	return (
		<>
			{levels.map((level) => (
				<DifficultyOptionItem key={level} level={level} onSelect={onSelect} />
			))}
		</>
	);
}
