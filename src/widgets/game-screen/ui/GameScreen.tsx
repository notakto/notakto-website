"use client";

import type { ReactNode } from "react";
import { isBoardDead } from "@/entities/game/lib/rules";
import type {
	BoardSize,
	BoardState,
	GameMode,
	MoveLogEntry,
} from "@/entities/game/model/types";
import Board from "@/widgets/board/ui/Board";
import BoardDisplay from "@/widgets/board-display/ui/BoardDisplay";
import BoardPreviewGrid from "@/widgets/board-preview-grid/ui/BoardPreviewGrid";
import BoardSelector from "@/widgets/board-selector/ui/BoardSelector";
import GameActionBar, {
	type GameAction,
} from "@/widgets/game-action-bar/ui/GameActionBar";
import GameCenterColumn from "@/widgets/game-center-column/ui/GameCenterColumn";
import GameContentArea from "@/widgets/game-content-area/ui/GameContentArea";
import GameLayout from "@/widgets/game-layout/ui/GameLayout";
import GameLeftPanel from "@/widgets/game-left-panel/ui/GameLeftPanel";
import GameStatsPanel from "@/widgets/game-stats-panel/ui/GameStatsPanel";
import GameStatusBar from "@/widgets/game-status-bar/ui/GameStatusBar";
import GameTopBar from "@/widgets/game-top-bar/ui/GameTopBar";

interface PlayerPanel {
	name: string;
	moveCount: number;
}

interface StatItem {
	label: string;
	value: string | number;
}

export interface GameScreenProps {
	mode: Exclude<GameMode, null>;
	boards: BoardState[];
	boardSize: BoardSize;
	currentPlayer: 1 | 2;
	player1: PlayerPanel;
	player2: PlayerPanel;
	selectedBoard: number;
	showPreview: boolean;
	gameOver: boolean;
	turnMoveCount: number;
	moveLog: MoveLogEntry[];
	stats: StatItem[];
	actions: GameAction[];
	cellOwnersByBoard?: Record<number, Record<number, 1 | 2>>;
	walletSlot?: ReactNode;
	onSelectBoard: (index: number) => void;
	onTogglePreviewBoard: (index: number) => void;
	onMakeMove: (boardIndex: number, cellIndex: number) => void;
}

export default function GameScreen({
	mode,
	boards,
	boardSize,
	currentPlayer,
	player1,
	player2,
	selectedBoard,
	showPreview,
	gameOver,
	turnMoveCount,
	moveLog,
	stats,
	actions,
	cellOwnersByBoard = {},
	walletSlot,
	onSelectBoard,
	onTogglePreviewBoard,
	onMakeMove,
}: GameScreenProps) {
	const lastMove = moveLog.length > 0 ? moveLog[moveLog.length - 1] : null;

	return (
		<GameLayout>
			<GameTopBar
				player1={player1}
				player2={player2}
				currentPlayer={currentPlayer}
				boards={boards}
				boardSize={boardSize}
				gameOver={gameOver}
				mode={mode}
			/>

			<GameContentArea>
				<GameLeftPanel topSlot={walletSlot}>
					<BoardSelector
						boards={boards}
						boardSize={boardSize}
						selectedBoard={selectedBoard}
						onSelectBoard={onSelectBoard}
					/>
				</GameLeftPanel>

				<GameCenterColumn
					mobileBoardSelector={
						!showPreview ? (
							<BoardSelector
								boards={boards}
								boardSize={boardSize}
								selectedBoard={selectedBoard}
								onSelectBoard={onSelectBoard}
							/>
						) : undefined
					}>
					<GameStatusBar
						currentPlayer={currentPlayer}
						moveCount={turnMoveCount}
						gameOver={gameOver}
						mode={mode}
						player1Name={player1.name}
						player2Name={player2.name}
					/>
					{showPreview ? (
						<BoardPreviewGrid
							boards={boards}
							boardSize={boardSize}
							moveLog={moveLog}
							onSelectBoard={onTogglePreviewBoard}
						/>
					) : (
						<BoardDisplay
							visible={boards.length > 0 && !!boards[selectedBoard]}>
							{boards[selectedBoard] && (
								<Board
									boardIndex={selectedBoard}
									boardState={boards[selectedBoard]}
									makeMove={onMakeMove}
									isDead={isBoardDead(boards[selectedBoard], boardSize)}
									boardSize={boardSize}
									cellOwners={cellOwnersByBoard[selectedBoard]}
									lastMoveCell={
										lastMove?.board === selectedBoard
											? lastMove.cell
											: undefined
									}
								/>
							)}
						</BoardDisplay>
					)}
				</GameCenterColumn>

				<GameStatsPanel stats={stats} moveLog={moveLog} boardSize={boardSize} />
			</GameContentArea>

			<GameActionBar actions={actions} />
		</GameLayout>
	);
}
