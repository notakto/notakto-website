import { isBoardDead } from "@/entities/game/lib/rules";
import type { BoardState } from "@/entities/game/model/types";
import BoardStatusDot from "@/widgets/board-status-dot/ui/BoardStatusDot";
import BoardsAliveCount from "@/widgets/boards-alive-count/ui/BoardsAliveCount";

interface BoardStatusDotsProps {
	boards: BoardState[];
	boardSize: number;
}

export default function BoardStatusDots({
	boards,
	boardSize,
}: BoardStatusDotsProps) {
	const aliveCount = boards.filter(
		(board) => !isBoardDead(board, boardSize),
	).length;

	return (
		<div className="text-center shrink-0">
			<div className="flex justify-center gap-2">
				{[...boards.entries()].map(([index, board]) => (
					<BoardStatusDot
						key={`dot-${index}`}
						dead={isBoardDead(board, boardSize)}
					/>
				))}
			</div>
			<BoardsAliveCount aliveCount={aliveCount} />
		</div>
	);
}
