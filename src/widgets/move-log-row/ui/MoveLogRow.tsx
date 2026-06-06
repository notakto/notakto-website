import type { MoveLogEntry } from "@/entities/game/model/types";
import MoveLogBoardLabel from "@/widgets/move-log-board-label/ui/MoveLogBoardLabel";
import MoveLogCellLabel from "@/widgets/move-log-cell-label/ui/MoveLogCellLabel";
import MoveLogPlayerTag from "@/widgets/move-log-player-tag/ui/MoveLogPlayerTag";
import MoveLogRowNumber from "@/widgets/move-log-row-number/ui/MoveLogRowNumber";

interface MoveLogRowProps {
	entry: MoveLogEntry;
	index: number;
	boardSize: number;
	isLatest: boolean;
}

export default function MoveLogRow({
	entry,
	index,
	boardSize,
	isLatest,
}: MoveLogRowProps) {
	const row = Math.floor(entry.cell / boardSize);
	const col = entry.cell % boardSize;

	return (
		<div
			className={`flex items-center gap-2 px-4 py-1.5 border-l-[3px] ${
				entry.player === 1 ? "border-l-primary" : "border-l-accent"
			} ${isLatest ? "bg-accent/5 animate-slide-up" : ""}`}>
			<MoveLogRowNumber index={index} />
			<MoveLogPlayerTag player={entry.player} />
			<MoveLogBoardLabel board={entry.board} />
			<MoveLogCellLabel row={row} col={col} />
		</div>
	);
}
