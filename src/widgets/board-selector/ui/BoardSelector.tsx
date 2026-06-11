import { isBoardDead } from "@/entities/game/lib/rules";
import type { BoardSize, BoardState } from "@/entities/game/model/types";
import BoardSelectorTab from "@/widgets/board-selector-tab/ui/BoardSelectorTab";

interface BoardSelectorProps {
	boards: BoardState[];
	boardSize: BoardSize;
	selectedBoard: number;
	onSelectBoard: (index: number) => void;
}

export default function BoardSelector({
	boards,
	boardSize,
	selectedBoard,
	onSelectBoard,
}: BoardSelectorProps) {
	if (boards.length <= 1) return null;

	return (
		<div className="w-full flex-wrap flex flex-row md:flex-1 md:flex-col items-center md:items-end justify-center gap-2.5 sm:gap-3 md:gap-2.5 overflow-x-auto md:overflow-x-visible px-2 sm:px-3 md:px-0">
			{[...boards.entries()].map(([i, board]) => {
				const dead = isBoardDead(board, boardSize);
				const selected = i === selectedBoard;
				return (
					<BoardSelectorTab
						key={`tab-${i}`}
						boardNumber={i + 1}
						dead={dead}
						selected={selected}
						onSelect={() => onSelectBoard(i)}
					/>
				);
			})}
		</div>
	);
}
