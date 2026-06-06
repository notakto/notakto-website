import BoardCell from "@/widgets/board-cell/ui/BoardCell";
import BoardLiveContainer from "@/widgets/board-live-container/ui/BoardLiveContainer";

interface LiveBoard {
	grid: string[];
	blocked: boolean;
}

interface LiveMatchBoardProps {
	board: LiveBoard;
	boardIndex: number;
	boardKey: string;
	isMyTurn: boolean;
	onMove: (boardIndex: number, cellIndex: number) => void;
}

export default function LiveMatchBoard({
	board,
	boardIndex,
	boardKey,
	isMyTurn,
	onMove,
}: LiveMatchBoardProps) {
	return (
		<BoardLiveContainer key={boardKey} blocked={board.blocked}>
			{[...board.grid.entries()].map(([cellIndex, cell]) => (
				<BoardCell
					key={`cell-${cellIndex}-${cell}`}
					value={cell}
					onClick={() => onMove(boardIndex, cellIndex)}
					disabled={!isMyTurn || board.blocked || cell !== ""}
				/>
			))}
		</BoardLiveContainer>
	);
}
