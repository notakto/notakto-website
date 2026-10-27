"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	INACTIVITY_TIMEOUT_MS,
	useInactivityTimer,
} from "@/features/local-match/model/useInactivityTimer";
import { useLocalMatchController } from "@/features/local-match/model/useLocalMatchController";
import BoardConfigModal from "@/widgets/board-config-modal/ui/BoardConfigModal";
import ConfirmationModal from "@/widgets/confirmation-modal/ui/ConfirmationModal";
import GameScreen from "@/widgets/game-screen/ui/GameScreen";
import PlayerNamesModal from "@/widgets/player-names-modal/ui/PlayerNamesModal";
import WinnerModal from "@/widgets/winner-modal/ui/WinnerModal";

export default function VsPlayerGameScreen() {
	const [inactivityModalOpen, setInactivityModalOpen] = useState(false);
	const match = useLocalMatchController({ isPaused: inactivityModalOpen });
	const router = useRouter();

	const isGameRunning =
		match.initialSetupDone &&
		match.activeModal === null &&
		!match.winner &&
		!inactivityModalOpen;

	const { resetTimer } = useInactivityTimer({
		enabled: isGameRunning,
		timeoutMs: INACTIVITY_TIMEOUT_MS,
		onTimeout: () => setInactivityModalOpen(true),
	});

	const handleContinue = useCallback(() => {
		setInactivityModalOpen(false);
		resetTimer();
	}, [resetTimer]);

	const handleExit = () => {
		setInactivityModalOpen(false);
		router.push("/");
	};

	useEffect(() => {
		if (!inactivityModalOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				const activeTag = document.activeElement?.tagName?.toLowerCase();
				if (activeTag === "button") {
					return;
				}
				e.preventDefault();
				handleContinue();
			} else {
				e.stopPropagation();
			}
		};

		window.addEventListener("keydown", handleKeyDown, { capture: true });
		return () => {
			window.removeEventListener("keydown", handleKeyDown, { capture: true });
		};
	}, [inactivityModalOpen, handleContinue]);

	return (
		<>
			<GameScreen
				mode="vsPlayer"
				boards={match.boards}
				boardSize={match.boardSize}
				currentPlayer={match.currentPlayer}
				player1={match.player1}
				player2={match.player2}
				selectedBoard={match.selectedBoard}
				showPreview={match.showPreview}
				gameOver={match.activeModal === "winner"}
				turnMoveCount={match.moveLog.length}
				moveLog={match.moveLog}
				stats={match.stats}
				actions={match.actions}
				cellOwnersByBoard={match.cellOwnersByBoard}
				onSelectBoard={inactivityModalOpen ? () => {} : match.setSelectedBoard}
				onTogglePreviewBoard={
					inactivityModalOpen ? () => {} : match.onSelectPreviewBoard
				}
				onMakeMove={inactivityModalOpen ? () => {} : match.makeMove}
			/>
			<PlayerNamesModal
				visible={match.activeModal === "names"}
				onSubmit={match.submitPlayerNames}
				onClose={match.initialSetupDone ? match.closeModal : undefined}
				initialNames={[match.player1Name, match.player2Name]}
				key={match.player1Name + match.player2Name}
			/>
			<WinnerModal
				visible={match.activeModal === "winner"}
				winner={match.winner}
				onPlayAgain={match.playAgain}
				onMenu={match.goToMenu}
			/>
			<BoardConfigModal
				visible={match.activeModal === "boardConfig"}
				currentBoards={match.numberOfBoards}
				currentSize={match.boardSize}
				onConfirm={match.handleBoardConfigChange}
				onCancel={match.closeModal}
			/>
			<ConfirmationModal
				visible={match.activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={match.confirmReset}
				onCancel={match.closeModal}
				confirmText="Yes, Reset"
			/>
			<ConfirmationModal
				visible={match.activeModal === "exitConfirmation"}
				title="Exit to Menu?"
				message="Are you sure you want to exit? Your current game will be lost."
				onConfirm={match.confirmExit}
				onCancel={match.closeModal}
				confirmText="Yes, Exit"
			/>
			<ConfirmationModal
				visible={inactivityModalOpen}
				title="Are You Still Playing?"
				message="Game paused due to inactivity. Would you like to continue playing?"
				onConfirm={handleContinue}
				onCancel={handleExit}
				confirmText="Continue Playing"
				cancelText="Exit to Menu"
				overlayClassName="z-[9999]"
				confirmId="inactivity-continue-btn"
				cancelId="inactivity-exit-btn"
			/>
		</>
	);
}
