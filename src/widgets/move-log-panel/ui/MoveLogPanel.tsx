import type { RefObject } from "react";
import type { MoveLogEntry } from "@/entities/game/model/types";
import MoveLogEmptyState from "@/widgets/move-log-empty-state/ui/MoveLogEmptyState";
import MoveLogHeader from "@/widgets/move-log-header/ui/MoveLogHeader";
import MoveLogRow from "@/widgets/move-log-row/ui/MoveLogRow";

interface MoveLogPanelProps {
	moveLog: MoveLogEntry[];
	boardSize: number;
	logEndRef: RefObject<HTMLDivElement | null>;
}

export default function MoveLogPanel({
	moveLog,
	boardSize,
	logEndRef,
}: MoveLogPanelProps) {
	return (
		<div className="pixel-border bg-bg2 p-0 flex-1 flex flex-col min-h-0 overflow-hidden">
			<MoveLogHeader count={moveLog.length} />
			<div className="flex-1 overflow-y-auto py-1.5 min-h-0">
				{moveLog.length === 0 && <MoveLogEmptyState />}
				{[...moveLog.entries()].map(([index, entry]) => (
					<MoveLogRow
						key={`move-${index}`}
						entry={entry}
						index={index}
						boardSize={boardSize}
						isLatest={index === moveLog.length - 1}
					/>
				))}
				<div ref={logEndRef} />
			</div>
		</div>
	);
}
