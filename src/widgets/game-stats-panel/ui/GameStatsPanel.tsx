"use client";

import { useEffect, useRef } from "react";
import type { MoveLogEntry } from "@/entities/game/model/types";
import GameStatsCard from "@/widgets/game-stats-card/ui/GameStatsCard";
import MoveLogPanel from "@/widgets/move-log-panel/ui/MoveLogPanel";

interface StatItem {
	label: string;
	value: string | number;
}

interface GameStatsPanelProps {
	stats: StatItem[];
	moveLog: MoveLogEntry[];
	boardSize: number;
}

export default function GameStatsPanel({
	stats,
	moveLog,
	boardSize,
}: GameStatsPanelProps) {
	const logEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (moveLog.length === 0) return;
		logEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [moveLog.length]);

	return (
		<div className="hidden lg:flex w-64 flex-col gap-2.5 shrink-0 pt-3 min-h-0">
			<GameStatsCard stats={stats} />
			<MoveLogPanel
				moveLog={moveLog}
				boardSize={boardSize}
				logEndRef={logEndRef}
			/>
		</div>
	);
}
