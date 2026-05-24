import BoardGrid from "@/widgets/game-screen/ui/board/BoardGrid";
import SingleBoardContainer from "@/widgets/game-screen/ui/board/containers/SingleBoardContainer";
import Cell from "@/widgets/game-screen/ui/cell/Cell";
import type { BoardProps } from "@/widgets/ui/types";

const Board: React.FC<BoardProps> = ({
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
