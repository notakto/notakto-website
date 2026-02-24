"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useShortcut } from "@/components/hooks/useShortcut";
import { useVsComputer } from "@/components/hooks/useVsComputerGame";
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
import WalletBadge from "@/components/ui/Game/WalletBadge";
import GameLayout from "@/components/ui/Layout/GameLayout";
import { TOAST_IDS } from "@/constants/toast";
import BoardConfigModal from "@/modals/BoardConfigModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import DifficultyModal from "@/modals/DifficultyModal";
import WinnerModal from "@/modals/WinnerModal";
import { useGlobalModal } from "@/services/globalModal";
import { isBoardDead } from "@/services/logic";
import { useCoins, useUser, useXP } from "@/services/store";
import type { DifficultyLevel } from "@/services/types";
import countTotalMoves from "@/utils/countTotalMoves";
import formatTime from "@/utils/format";

const Game = () => {
	const hasInitializedRef = useRef(false);
	const { activeModal, openModal, closeModal } = useGlobalModal();

	const game = useVsComputer();

	const Coins = useCoins((state) => state.coins);
	const XP = useXP((state) => state.XP);
	const user = useUser((state) => state.user);
	const router = useRouter();

	useShortcut(
		{
			escape: () => {
				if (activeModal === "winner") return;
				if (activeModal) return closeModal();
			},

			m: () => {
				if (activeModal === "winner") return;
				activeModal === "exitConfirmation"
					? closeModal()
					: openModal("exitConfirmation");
			},

			r: () => {
				if (activeModal === "winner" || !game.hasMoveHappened) return;
				activeModal === "resetConfirmation"
					? closeModal()
					: openModal("resetConfirmation");
			},

			c: () => {
				if (activeModal === "winner") return;
				activeModal === "boardConfig" ? closeModal() : openModal("boardConfig");
			},

			s: () => {
				if (activeModal === "winner") return;
				activeModal === "soundConfig" ? closeModal() : openModal("soundConfig");
			},

			d: () => {
				if (activeModal === "winner") return;
				activeModal === "difficulty" ? closeModal() : openModal("difficulty");
			},

			q: () => {
				if (activeModal === "winner") return;
				activeModal === "shortcut" ? closeModal() : openModal("shortcut");
			},
			p: () => {
				if (activeModal === "winner") return;
				activeModal === "profile" ? closeModal() : openModal("profile");
			},
		},
		false,
	);

	const authReady = useUser((s) => s.authReady);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <effect runs when authReady or user changes; hasInitializedRef prevents duplicate initialization>
	useEffect(() => {
		if (!authReady) return;
		if (!user) {
			toast("Please sign in!", {
				toastId: TOAST_IDS.User.SignInError,
			});
			router.push("/");
			return;
		}

		if (hasInitializedRef.current) return;

		let cancelled = false;

		const init = async () => {
			await game.initGame(game.numberOfBoards, game.boardSize, game.difficulty);
			if (cancelled) return;
			hasInitializedRef.current = true;
		};

		void init();

		return () => {
			cancelled = true;
		};
	}, [authReady, user]);

	const playerMoveCount = game.moveLog.filter((m) => m.player === 1).length;
	const cpuMoveCount = game.moveLog.filter((m) => m.player === 2).length;
	const totalMoves = countTotalMoves(game.boards);
	const aliveCount = game.boards.filter(
		(b) => !isBoardDead(b, game.boardSize),
	).length;

	const lastMove =
		game.moveLog.length > 0 ? game.moveLog[game.moveLog.length - 1] : null;

	return (
		<GameLayout>
			<GameTopBar
				player1={{
					name: "You",
					moveCount: playerMoveCount,
				}}
				player2={{
					name: "CPU",
					moveCount: cpuMoveCount,
				}}
				currentPlayer={game.currentPlayer as 1 | 2}
				boards={game.boards}
				boardSize={game.boardSize}
				gameOver={activeModal === "winner"}
				mode="vsComputer"
			/>

			<GameContentArea>
				<GameLeftPanel topSlot={<WalletBadge coins={Coins} xp={XP} />}>
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
						currentPlayer={game.currentPlayer as 1 | 2}
						moveCount={totalMoves}
						gameOver={activeModal === "winner"}
						mode="vsComputer"
						player1Name="You"
						player2Name="CPU"
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
									makeMove={game.handleMove}
									isDead={isBoardDead(
										game.boards[game.selectedBoard],
										game.boardSize,
									)}
									boardSize={game.boardSize}
									cellOwners={game.cellOwnersByBoard[game.selectedBoard]}
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
						{ label: "TOTAL MOVES", value: totalMoves },
						{ label: "BOARDS ALIVE", value: aliveCount },
						{ label: "TIME", value: formatTime(game.elapsed) },
					]}
					moveLog={game.moveLog}
					boardSize={game.boardSize}
				/>
			</GameContentArea>

			{/* Sticky action bar */}
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
						label: `UNDO (${100})`,
						onClick: game.handleUndo,
						disabled: Coins < 100 || game.isUndoing || !game.hasMoveHappened,
					},
					{
						label: `SKIP (${200})`,
						onClick: game.handleSkip,
						disabled: Coins < 200 || game.isSkipping,
					},
					{
						label: "RESIGN",
						onClick: () => openModal("exitConfirmation"),
						variant: "danger",
					},
				]}
			/>

			{/* Modals — game-specific only (soundConfig/shortcut/profile handled by GlobalModals) */}
			<WinnerModal
				visible={activeModal === "winner"}
				winner={game.winner}
				onPlayAgain={() => {
					closeModal();
					game.handleReset();
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
				onConfirm={(boards, size) => {
					game.handleBoardConfigChange(boards, size);
					closeModal();
				}}
				onCancel={closeModal}
			/>
			<DifficultyModal
				visible={activeModal === "difficulty"}
				onSelect={(level: DifficultyLevel) => {
					game.handleDifficultyChange(level);
					closeModal();
				}}
				onClose={closeModal}
			/>
			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					game.handleReset();
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
