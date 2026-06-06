import type { FC } from "react";
import type { BoardState } from "@/entities/game/model/types";
import BoardGrid from "@/widgets/board-grid/ui/BoardGrid";
import Cell from "@/widgets/cell/ui/Cell";
import SingleBoardContainer from "@/widgets/single-board-container/ui/SingleBoardContainer";

interface BoardProps {
	boardIndex: number;
	boardState: BoardState;
	makeMove: (boardIndex: number, cellIndex: number) => void;
	isDead: boolean;
	boardSize: number;
	cellOwners?: Record<number, 1 | 2>;
	lastMoveCell?: number;
}

const Board: FC<BoardProps> = ({
	boardIndex,
	boardState,
	makeMove,
	isDead,
	boardSize,
	cellOwners,
	lastMoveCell,
}) => {
	return (
		<SingleBoardContainer isDead={isDead}>
			<BoardGrid boardSize={boardSize}>
				{[...boardState.entries()].map(([cellIndex, cell]) => (
					<Cell
						key={`${boardIndex}-${cellIndex}-${cell}`}
						boardIndex={boardIndex}
						cellIndex={cellIndex}
						value={cell}
						onPress={makeMove}
						disabled={isDead}
						boardSize={boardSize}
						owner={cellOwners?.[cellIndex]}
						isLastMove={cellIndex === lastMoveCell}
					/>
				))}
			</BoardGrid>
		</SingleBoardContainer>
	);
};

export default Board;
