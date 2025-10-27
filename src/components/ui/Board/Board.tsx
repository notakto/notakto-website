import BoardGrid from "@/components/ui/Board/BoardGrid";
import Cell from "@/components/ui/Cell/Cell";
import SingleBoardContainer from "@/components/ui/Containers/Board/SingleBoardContainer";
import type { BoardProps } from "@/services/types";

const Board: React.FC<BoardProps> = ({
	boardIndex,
	boardState,
	makeMove,
	isDead,
	boardSize,
}) => {
	return (
		<SingleBoardContainer isDead={isDead}>
			<BoardGrid boardSize={boardSize}>
				{boardState.map((cell, cellIndex) => (
					<Cell
						key={`${boardIndex}-${cellIndex}-${cell}`} //FIXME: Improve key
						boardIndex={boardIndex}
						cellIndex={cellIndex}
						value={cell}
						onPress={makeMove}
						disabled={isDead}
						boardSize={boardSize}
					/>
				))}
			</BoardGrid>
		</SingleBoardContainer>
	);
};

export default Board;
