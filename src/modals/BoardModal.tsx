"use client";
import BoardGrid from "@/components/ui/Containers/Board/BoardGrid";
import SingleBoardContainer from "@/components/ui/Containers/Board/SingleBoardContainer";
import CellModal from "@/modals/CellModal";
import type { BoardProps } from "@/services/types";

const BoardModal: React.FC<BoardProps> = ({
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
					<CellModal
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

export default BoardModal;
