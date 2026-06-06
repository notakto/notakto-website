import type { BoardNumber, BoardSize } from "@/entities/game/model/types";
import { BoardConfigButton } from "@/widgets/board-config-button/ui/BoardConfigButton";

interface BoardConfigOptionItemProps {
	label: string | number;
	value: BoardNumber | BoardSize;
	isActive: boolean;
	onSelect: (value: BoardNumber | BoardSize) => void;
}

export default function BoardConfigOptionItem({
	label,
	value,
	isActive,
	onSelect,
}: BoardConfigOptionItemProps) {
	return (
		<li>
			<BoardConfigButton
				label={label}
				isActive={isActive}
				onClick={() => onSelect(value)}
			/>
		</li>
	);
}
