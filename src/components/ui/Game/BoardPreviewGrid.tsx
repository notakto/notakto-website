import clsx from "clsx";
import BoardGrid from "@/components/ui/Board/BoardGrid";
import type { MoveLogEntry } from "@/components/ui/Game/GameTopBar";
import { isBoardDead } from "@/services/logic";
import type { BoardSize, BoardState } from "@/services/types";

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
		<div className="w-full overflow-y-auto p-2 sm:p-3 md:p-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{[...boards.entries()].map(([boardIndex, board]) => {
					const dead = isBoardDead(board, boardSize);
					return (
						<button
							type="button"
							key={`preview-${boardIndex}`}
							onClick={() => onSelectBoard(boardIndex)}
							className={clsx(
								"flex flex-col items-center gap-2 p-3 border-2 cursor-pointer transition-all",
								"bg-bg2 border-border-pixel hover:border-accent hover:shadow-[2px_2px_0_var(--color-accent)]",
								dead && "opacity-60",
							)}>
							<div className="flex items-center gap-2">
								<span className="font-pixel text-[9px] sm:text-[10px] text-cream uppercase tracking-wider">
									Board {boardIndex + 1}
								</span>
								<span
									className={clsx(
										"w-2.5 h-2.5 rounded-full border border-bg0",
										dead ? "bg-dead" : "bg-success",
									)}
								/>
							</div>
							<div className="w-full max-w-[200px]">
								<BoardGrid boardSize={boardSize}>
									{[...board.entries()].map(([cellIndex, cell]) => {
										const owner = cellOwner.get(`${boardIndex}-${cellIndex}`);
										const isLast =
											lastMove?.board === boardIndex &&
											lastMove?.cell === cellIndex;
										return (
											<div
												key={`preview-${boardIndex}-${cellIndex}`}
												className={clsx(
													"relative flex items-center justify-center aspect-square",
													cell === "X" ? "bg-dead" : "bg-board-bg",
													isLast
														? owner === 2
															? "border-2 border-yellow-400"
															: "border-2 border-red-500"
														: "border border-bg3",
												)}>
												{cell && (
													<span
														className={clsx(
															"text-xs font-pixel leading-none",
															owner === 2
																? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
																: "text-x drop-shadow-[0_0_4px_rgba(196,60,60,0.6)]",
														)}>
														{cell}
													</span>
												)}
											</div>
										);
									})}
								</BoardGrid>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
