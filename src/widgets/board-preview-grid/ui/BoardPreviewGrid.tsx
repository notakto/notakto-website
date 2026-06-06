import { isBoardDead } from "@/entities/game/lib/rules";
import type {
	BoardSize,
	BoardState,
	MoveLogEntry,
} from "@/entities/game/model/types";
import BoardPreviewCard from "@/widgets/board-preview-card/ui/BoardPreviewCard";
import BoardPreviewGridFrame from "@/widgets/board-preview-grid-frame/ui/BoardPreviewGridFrame";

interface BoardPreviewGridProps {
	boards: BoardState[];
	boardSize: BoardSize;
	onSelectBoard: (index: number) => void;
	moveLog: MoveLogEntry[];
}

export default function BoardPreviewGrid({
	boards,
	boardSize,
	onSelectBoard,
	moveLog,
}: BoardPreviewGridProps) {
	// Build a lookup: (board, cell) -> player who placed the move
	const cellOwner = new Map<string, 1 | 2>();
	for (const entry of moveLog) {
		cellOwner.set(`${entry.board}-${entry.cell}`, entry.player);
	}

	const lastMove = moveLog.length > 0 ? moveLog[moveLog.length - 1] : null;

	return (
		<BoardPreviewGridFrame>
			{[...boards.entries()].map(([boardIndex, board]) => (
				<BoardPreviewCard
					key={`preview-${boardIndex}`}
					boardIndex={boardIndex}
					board={board}
					boardSize={boardSize}
					dead={isBoardDead(board, boardSize)}
					lastMove={lastMove}
					cellOwner={cellOwner}
					onSelectBoard={onSelectBoard}
				/>
			))}
		</BoardPreviewGridFrame>
	);
}
