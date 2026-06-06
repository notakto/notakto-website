import clsx from "clsx";
import type {
	BoardSize,
	BoardState,
	MoveLogEntry,
} from "@/entities/game/model/types";
import BoardGrid from "@/widgets/board-grid/ui/BoardGrid";
import BoardPreviewCell from "@/widgets/board-preview-cell/ui/BoardPreviewCell";
import BoardPreviewStatusDot from "@/widgets/board-preview-status-dot/ui/BoardPreviewStatusDot";
import BoardPreviewTitle from "@/widgets/board-preview-title/ui/BoardPreviewTitle";

interface BoardPreviewCardProps {
	boardIndex: number;
	board: BoardState;
	boardSize: BoardSize;
	dead: boolean;
	lastMove: MoveLogEntry | null;
	cellOwner: Map<string, 1 | 2>;
	onSelectBoard: (index: number) => void;
}

export default function BoardPreviewCard({
	boardIndex,
	board,
	boardSize,
	dead,
	lastMove,
	cellOwner,
	onSelectBoard,
}: BoardPreviewCardProps) {
	return (
		<button
			type="button"
			onClick={() => onSelectBoard(boardIndex)}
			className={clsx(
				"flex flex-col items-center gap-2 p-3 border-2 cursor-pointer transition-all",
				"bg-bg2 border-border-pixel hover:border-accent hover:shadow-[2px_2px_0_var(--color-accent)]",
				dead && "opacity-60",
			)}>
			<div className="flex items-center gap-2">
				<BoardPreviewTitle boardNumber={boardIndex + 1} />
				<BoardPreviewStatusDot dead={dead} />
			</div>
			<div className="w-full max-w-50">
				<BoardGrid boardSize={boardSize}>
					{[...board.entries()].map(([cellIndex, cell]) => {
						const owner = cellOwner.get(`${boardIndex}-${cellIndex}`);
						const isLast =
							lastMove?.board === boardIndex && lastMove?.cell === cellIndex;

						return (
							<BoardPreviewCell
								key={`preview-${boardIndex}-${cellIndex}`}
								cell={cell}
								owner={owner}
								isLast={isLast}
							/>
						);
					})}
				</BoardGrid>
			</div>
		</button>
	);
}
