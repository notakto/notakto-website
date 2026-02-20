"use client";

import { isBoardDead } from "@/services/logic";
import type { BoardState } from "@/services/types";

export interface MoveLogEntry {
	player: 1 | 2;
	board: number;
	cell: number;
}

interface PlayerPanel {
	name: string;
	moveCount: number;
}

interface GameTopBarProps {
	player1: PlayerPanel;
	player2: PlayerPanel;
	currentPlayer: 1 | 2;
	boards: BoardState[];
	boardSize: number;
	gameOver: boolean;
	mode: "vsComputer" | "vsPlayer" | "liveMatch";
}

export default function GameTopBar({
	player1,
	player2,
	currentPlayer,
	boards,
	boardSize,
	gameOver,
}: GameTopBarProps) {
	const aliveCount = boards.filter((b) => !isBoardDead(b, boardSize)).length;

	return (
		<div className="flex items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3 md:gap-4 md:px-6 md:py-4 shrink-0">
			{/* Player 1 panel */}
			<div
				className={`flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 pixel-border flex-1 min-w-0 transition-colors ${
					currentPlayer === 1 && !gameOver ? "border-accent" : ""
				}`}>
				{currentPlayer === 1 && !gameOver && (
					<div className="w-1.5 self-stretch bg-accent animate-pulse-pixel shrink-0" />
				)}
				<div className="min-w-0 flex-1">
					<div className="font-pixel text-[10px] sm:text-[11px] md:text-[12px] text-cream uppercase tracking-wider truncate">
						{player1.name}
					</div>
					<div className="flex items-center gap-2 mt-1">
						<span className="font-pixel text-[8px] md:text-[9px] text-cream-dim">
							{player1.moveCount} MOVES
						</span>
					</div>
				</div>
			</div>

			{/* Center: board dots + alive count */}
			<div className="text-center shrink-0">
				<div className="flex justify-center gap-2">
					{boards.map((board, i) => {
						const dead = isBoardDead(board, boardSize);
						return (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: board index is the stable identity
								key={`dot-${i}`}
								className={`w-3 h-3 md:w-3.5 md:h-3.5 transition-all duration-300 ${
									dead
										? "bg-dead border-2 border-dead-border"
										: "bg-success border-2 border-success-dim"
								}`}
							/>
						);
					})}
				</div>
				<div className="font-pixel text-[8px] text-muted mt-1.5">
					{aliveCount} BOARD{aliveCount !== 1 ? "S" : ""} ALIVE
				</div>
			</div>

			{/* Player 2 panel */}
			<div
				className={`flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 pixel-border flex-1 min-w-0 transition-colors ${
					currentPlayer === 2 && !gameOver ? "border-accent" : ""
				}`}>
				<div className="min-w-0 flex-1 text-right">
					<div className="font-pixel text-[10px] sm:text-[11px] md:text-[12px] text-cream uppercase tracking-wider truncate">
						{player2.name}
					</div>
					<div className="flex items-center gap-2 mt-1 justify-end">
						<span className="font-pixel text-[8px] md:text-[9px] text-cream-dim">
							{player2.moveCount} MOVES
						</span>
					</div>
				</div>
				{currentPlayer === 2 && !gameOver && (
					<div className="w-1.5 self-stretch bg-accent animate-pulse-pixel shrink-0" />
				)}
			</div>
		</div>
	);
}

/** Turn indicator strip. Sits between top bar and boards, centered to the board area. */
export function GameStatusBar({
	currentPlayer,
	moveCount,
	gameOver,
	mode,
	player1Name,
	player2Name,
}: {
	currentPlayer: 1 | 2;
	moveCount: number;
	gameOver: boolean;
	mode: "vsComputer" | "vsPlayer" | "liveMatch";
	player1Name: string;
	player2Name: string;
}) {
	const turnLabel =
		mode === "vsComputer"
			? currentPlayer === 1
				? "YOUR TURN"
				: "CPU TURN"
			: mode === "liveMatch"
				? currentPlayer === 1
					? "YOUR TURN"
					: "OPPONENT TURN"
				: currentPlayer === 1
					? `${player1Name.toUpperCase()}'S TURN`
					: `${player2Name.toUpperCase()}'S TURN`;

	return (
		<div className="text-center py-2 px-3 sm:py-3 sm:px-4 md:py-4 md:px-4 shrink-0">
			{gameOver ? (
				<div className="font-pixel text-[20px] sm:text-[24px] md:text-[32px] text-accent animate-pulse-pixel pixel-text-shadow">
					GAME OVER
				</div>
			) : (
				<>
					<div className="font-pixel text-[10px] sm:text-[11px] md:text-[12px] text-muted uppercase tracking-wider">
						TURN {moveCount + 1}
					</div>
					<div
						className={`font-pixel text-[16px] sm:text-[20px] md:text-[28px] mt-0.5 md:mt-1 animate-pulse-pixel pixel-text-shadow ${
							currentPlayer === 1 ? "text-primary" : "text-accent"
						}`}>
						{currentPlayer === 1 ? "\u25C0 " : ""}
						{turnLabel}
						{currentPlayer === 2 ? " \u25B6" : ""}
					</div>
				</>
			)}
		</div>
	);
}
