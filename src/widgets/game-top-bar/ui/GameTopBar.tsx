"use client";

import type { BoardState } from "@/entities/game/model/types";
import BoardStatusDots from "@/widgets/board-status-dots/ui/BoardStatusDots";
import PlayerPanelWidget from "@/widgets/player-panel/ui/PlayerPanel";

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
	return (
		<div className="flex items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3 md:gap-4 md:px-6 md:py-4 shrink-0">
			<PlayerPanelWidget
				name={player1.name}
				moveCount={player1.moveCount}
				active={currentPlayer === 1 && !gameOver}
				side={1}
			/>
			<BoardStatusDots boards={boards} boardSize={boardSize} />
			<PlayerPanelWidget
				name={player2.name}
				moveCount={player2.moveCount}
				active={currentPlayer === 2 && !gameOver}
				side={2}
			/>
		</div>
	);
}
