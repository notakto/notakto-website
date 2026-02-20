import { isBoardDead } from "@/services/logic";
import type { BoardSize, BoardState } from "@/services/types";

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
		<div className="flex flex-row md:flex-1 md:flex-col items-center md:items-end justify-center gap-2.5 sm:gap-3 md:gap-2.5 overflow-x-auto md:overflow-x-visible px-2 sm:px-3 md:px-0">
			{[...boards.entries()].map(([i, board]) => {
				const dead = isBoardDead(board, boardSize);
				const selected = i === selectedBoard;
				return (
					<button
						key={`tab-${i}`}
						type="button"
						onClick={() => onSelectBoard(i)}
						className={`relative font-pixel text-[9px] sm:text-[10px] md:text-[10px] px-3.5 py-2.5 sm:px-4 md:px-5 md:py-3 flex items-center justify-center border-2 cursor-pointer transition-all whitespace-nowrap ${
							selected
								? "bg-bg3 border-accent text-cream shadow-[2px_2px_0_var(--color-accent)]"
								: dead
									? "bg-bg2 border-border-pixel text-muted"
									: "bg-bg2 border-border-pixel text-cream-dim hover:text-cream hover:border-accent/50"
						}`}>
						BOARD {i + 1}
						<span
							className={`absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border border-bg0 ${
								dead ? "bg-dead" : "bg-success"
							}`}
						/>
					</button>
				);
			})}
		</div>
	);
}
