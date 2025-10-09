import clsx from "clsx";
import Cell from "@/app/vsComputer/Cell";
import type { BoardProps } from "@/services/types";

const Board: React.FC<BoardProps> = ({
	boardIndex,
	boardState,
	makeMove,
	isDead,
	boardSize,
}) => {
	return (
		<div className={clsx("flex-1 p-2 max-w-full", isDead && "opacity-60")}>
			<div
				className="grid gap-1 w-full"
				style={{
					gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
					aspectRatio: "1/1",
				}}>
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
			</div>
		</div>
	);
};

export default Board;
