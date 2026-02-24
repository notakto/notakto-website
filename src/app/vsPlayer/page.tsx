"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShortcut } from "@/components/hooks/useShortcut";
import { useVsPlayerGame } from "@/components/hooks/useVsPlayerGame";
import Board from "@/components/ui/Board/Board";
import BoardDisplay from "@/components/ui/Game/BoardDisplay";
import BoardPreviewGrid from "@/components/ui/Game/BoardPreviewGrid";
import BoardSelector from "@/components/ui/Game/BoardSelector";
import GameActionBar from "@/components/ui/Game/GameActionBar";
import GameCenterColumn from "@/components/ui/Game/GameCenterColumn";
import GameContentArea from "@/components/ui/Game/GameContentArea";
import GameLeftPanel from "@/components/ui/Game/GameLeftPanel";
import GameStatsPanel from "@/components/ui/Game/GameStatsPanel";
import GameTopBar, { GameStatusBar } from "@/components/ui/Game/GameTopBar";
import GameLayout from "@/components/ui/Layout/GameLayout";
import BoardConfigModal from "@/modals/BoardConfigModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import PlayerNamesModal from "@/modals/PlayerNamesModal";
import WinnerModal from "@/modals/WinnerModal";
import { useGlobalModal } from "@/services/globalModal";
import { isBoardDead } from "@/services/logic";
import formatTime from "@/utils/format";

const Game = () => {
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [initialSetupDone, setInitialSetupDone] = useState<boolean>(false);
	const [player1Name, setPlayer1Name] = useState<string>("Player 1");
	const [player2Name, setPlayer2Name] = useState<string>("Player 2");

	const { activeModal, openModal, closeModal } = useGlobalModal();
	const game = useVsPlayerGame();
	const router = useRouter();

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only on mount
	useEffect(() => {
		openModal("names");
	}, []);

	useShortcut(
		{
			escape: () => {
				if ((!initialSetupDone && !gameStarted) || activeModal === "winner")
					return;
				if (activeModal) return closeModal();
			},
			m: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "exitConfirmation"
					? closeModal()
					: openModal("exitConfirmation");
			},
			r: () => {
				if (
					!initialSetupDone ||
					!game.hasMoveHappened ||
					activeModal === "winner"
				)
					return;
				activeModal === "resetConfirmation"
					? closeModal()
					: openModal("resetConfirmation");
			},
			n: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "names" ? closeModal() : openModal("names");
			},
			c: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "boardConfig" ? closeModal() : openModal("boardConfig");
			},
			s: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "soundConfig" ? closeModal() : openModal("soundConfig");
			},
			q: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "shortcut" ? closeModal() : openModal("shortcut");
			},
		},
		false,
	);

	const p1MoveCount = game.moveLog.filter((m) => m.player === 1).length;
	const p2MoveCount = game.moveLog.filter((m) => m.player === 2).length;
	const aliveCount = game.boards.filter(
		(b) => !isBoardDead(b, game.boardSize),
	).length;

	// Build per-board cell ownership maps from moveLog
	const cellOwnersByBoard: Record<number, Record<number, 1 | 2>> = {};
	for (const entry of game.moveLog) {
		if (!cellOwnersByBoard[entry.board]) {
			cellOwnersByBoard[entry.board] = {};
		}
		cellOwnersByBoard[entry.board][entry.cell] = entry.player;
	}

	const lastMove =
		game.moveLog.length > 0 ? game.moveLog[game.moveLog.length - 1] : null;

	return (
		<GameLayout>
			<GameTopBar
				player1={{
					name: player1Name,
					moveCount: p1MoveCount,
				}}
				player2={{
					name: player2Name,
					moveCount: p2MoveCount,
				}}
				currentPlayer={game.currentPlayer}
				boards={game.boards}
				boardSize={game.boardSize}
				gameOver={activeModal === "winner"}
				mode="vsPlayer"
			/>

			<GameContentArea>
				<GameLeftPanel>
					<BoardSelector
						boards={game.boards}
						boardSize={game.boardSize}
						selectedBoard={game.selectedBoard}
						onSelectBoard={game.setSelectedBoard}
					/>
				</GameLeftPanel>

				<GameCenterColumn
					mobileBoardSelector={
						!game.showPreview ? (
							<BoardSelector
								boards={game.boards}
								boardSize={game.boardSize}
								selectedBoard={game.selectedBoard}
								onSelectBoard={game.setSelectedBoard}
							/>
						) : undefined
					}>
					<GameStatusBar
						currentPlayer={game.currentPlayer}
						moveCount={game.moveLog.length}
						gameOver={activeModal === "winner"}
						mode="vsPlayer"
						player1Name={player1Name}
						player2Name={player2Name}
					/>
					{game.showPreview ? (
						<BoardPreviewGrid
							boards={game.boards}
							boardSize={game.boardSize}
							moveLog={game.moveLog}
							onSelectBoard={(index) => {
								game.setSelectedBoard(index);
								game.setShowPreview(false);
							}}
						/>
					) : (
						<BoardDisplay
							visible={
								game.boards.length > 0 && !!game.boards[game.selectedBoard]
							}>
							{game.boards[game.selectedBoard] && (
								<Board
									boardIndex={game.selectedBoard}
									boardState={game.boards[game.selectedBoard]}
									makeMove={game.makeMoveHandler}
									isDead={isBoardDead(
										game.boards[game.selectedBoard],
										game.boardSize,
									)}
									boardSize={game.boardSize}
									cellOwners={cellOwnersByBoard[game.selectedBoard]}
									lastMoveCell={
										lastMove?.board === game.selectedBoard
											? lastMove?.cell
											: undefined
									}
								/>
							)}
						</BoardDisplay>
					)}
				</GameCenterColumn>

				<GameStatsPanel
					stats={[
						{ label: "TOTAL MOVES", value: game.moveLog.length },
						{ label: "BOARDS ALIVE", value: aliveCount },
						{ label: "TIME", value: formatTime(game.elapsed) },
					]}
					moveLog={game.moveLog}
					boardSize={game.boardSize}
				/>
			</GameContentArea>

			{/* Action bar */}
			<GameActionBar
				actions={[
					...(game.boards.length > 1
						? [
								{
									label: game.showPreview ? "BACK" : "PREVIEW ALL",
									onClick: () => game.setShowPreview((prev) => !prev),
									variant: "primary" as const,
								},
							]
						: []),
					{
						label: "RESIGN",
						onClick: () => openModal("exitConfirmation"),
						variant: "danger",
					},
				]}
			/>

			{/* Modals */}
			<PlayerNamesModal
				visible={activeModal === "names"}
				onSubmit={(name1: string, name2: string) => {
					setPlayer1Name(name1 || "Player 1");
					setPlayer2Name(name2 || "Player 2");
					closeModal();
					game.resetGame(game.numberOfBoards, game.boardSize);
					setInitialSetupDone(true);
					setGameStarted(true);
				}}
				onClose={initialSetupDone ? closeModal : undefined}
				initialNames={[player1Name, player2Name]}
				key={player1Name + player2Name}
			/>
			<WinnerModal
				visible={activeModal === "winner"}
				winner={
					game.winner === 1 ? player1Name : game.winner === 2 ? player2Name : ""
				}
				onPlayAgain={() => {
					closeModal();
					game.resetGame(game.numberOfBoards, game.boardSize);
				}}
				onMenu={() => {
					closeModal();
					router.push("/");
				}}
			/>
			<BoardConfigModal
				visible={activeModal === "boardConfig"}
				currentBoards={game.numberOfBoards}
				currentSize={game.boardSize}
				onConfirm={game.handleBoardConfigChange}
				onCancel={closeModal}
			/>
			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					game.resetGame(game.numberOfBoards, game.boardSize);
					closeModal();
				}}
				onCancel={closeModal}
				confirmText="Yes, Reset"
			/>
			<ConfirmationModal
				visible={activeModal === "exitConfirmation"}
				title="Exit to Menu?"
				message="Are you sure you want to exit? Your current game will be lost."
				onConfirm={() => {
					router.push("/");
				}}
				onCancel={closeModal}
				confirmText="Yes, Exit"
			/>
		</GameLayout>
	);
};

export default Game;
