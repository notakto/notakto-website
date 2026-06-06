import BoardGridContainer from "@/widgets/board-grid-container/ui/BoardGridContainer";
import LiveMatchBoard from "@/widgets/live-match-board/ui/LiveMatchBoard";

interface LiveBoard {
	grid: string[];
	blocked: boolean;
}

interface LiveMatchBoardListProps {
	boards: LiveBoard[];
	roomId: string;
	isMyTurn: boolean;
	onMove: (boardIndex: number, cellIndex: number) => void;
}

export default function LiveMatchBoardList({
	boards,
	roomId,
	isMyTurn,
	onMove,
}: LiveMatchBoardListProps) {
	return (
		<BoardGridContainer>
			{boards.map((board, boardIndex) => {
				const boardKey = `board-${roomId}-${board.grid.join("")}-${board.blocked}`;
				return (
					<LiveMatchBoard
						key={boardKey}
						board={board}
						boardIndex={boardIndex}
						boardKey={boardKey}
						isMyTurn={isMyTurn}
						onMove={onMove}
					/>
				);
			})}
		</BoardGridContainer>
	);
}
