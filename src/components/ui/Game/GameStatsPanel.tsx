"use client";

import { useEffect, useRef } from "react";
import type { MoveLogEntry } from "@/components/ui/Game/GameTopBar";

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll when new moves are added
	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [moveLog.length]);

	return (
		<div className="hidden lg:flex w-64 flex-col gap-2.5 shrink-0 pt-3 min-h-0">
			{/* Match Stats */}
			<div className="pixel-border bg-bg2 p-4 shrink-0">
				<div className="font-pixel text-[9px] text-accent uppercase mb-3">
					MATCH STATS
				</div>
				<div className="grid grid-cols-2 gap-3">
					{stats.map((s) => (
						<div key={s.label} className="py-1">
							<div className="font-pixel text-[14px] text-cream">{s.value}</div>
							<div className="font-pixel text-[7px] text-muted uppercase mt-0.5">
								{s.label}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Move Log — fills remaining space down to footer */}
			<div className="pixel-border bg-bg2 p-0 flex-1 flex flex-col min-h-0 overflow-hidden">
				<div className="px-4 py-2.5 border-b-2 border-border-pixel flex items-center justify-between shrink-0">
					<span className="font-pixel text-[9px] text-accent">MOVE LOG</span>
					<span className="font-pixel text-[8px] text-muted">
						{moveLog.length}
					</span>
				</div>
				<div className="flex-1 overflow-y-auto py-1.5 min-h-0">
					{moveLog.length === 0 && (
						<div className="p-4 text-center">
							<div className="font-pixel text-[9px] text-border-pixel">
								NO MOVES YET
							</div>
							<div className="font-pixel text-[7px] text-border-pixel mt-1">
								CLICK A CELL TO BEGIN
							</div>
						</div>
					)}
					{[...moveLog.entries()].map(([i, m]) => {
						const row = Math.floor(m.cell / boardSize);
						const col = m.cell % boardSize;
						return (
							<div
								key={`move-${i}`}
								className={`flex items-center gap-2 px-4 py-1.5 border-l-[3px] ${
									m.player === 1 ? "border-l-primary" : "border-l-accent"
								} ${
									i === moveLog.length - 1 ? "bg-accent/5 animate-slide-up" : ""
								}`}>
								<span className="font-pixel text-[8px] text-muted w-6 text-right">
									{i + 1}.
								</span>
								<span
									className={`font-pixel text-[8px] w-7 ${m.player === 1 ? "text-primary" : "text-accent"}`}>
									{m.player === 1 ? "P1" : "P2"}
								</span>
								<span className="font-pixel text-[9px] text-cream">
									B{m.board + 1}
								</span>
								<span className="font-pixel text-[7px] text-muted">
									[{row},{col}]
								</span>
							</div>
						);
					})}
					<div ref={logEndRef} />
				</div>
			</div>
		</div>
	);
}
