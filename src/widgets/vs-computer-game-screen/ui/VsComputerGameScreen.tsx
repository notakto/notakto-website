"use client";

import { useComputerMatchController } from "@/features/computer-match/model/useComputerMatchController";
import BoardConfigModal from "@/widgets/board-config-modal/ui/BoardConfigModal";
import ConfirmationModal from "@/widgets/confirmation-modal/ui/ConfirmationModal";
import DifficultyModal from "@/widgets/difficulty-modal/ui/DifficultyModal";
import GameScreen from "@/widgets/game-screen/ui/GameScreen";
import WalletBadge from "@/widgets/wallet-badge/ui/WalletBadge";
import WinnerModal from "@/widgets/winner-modal/ui/WinnerModal";

export default function VsComputerGameScreen() {
	const match = useComputerMatchController();

	return (
		<>
			<GameScreen
				mode="vsComputer"
				boards={match.boards}
				boardSize={match.boardSize}
				currentPlayer={match.currentPlayer}
				player1={match.player1}
				player2={match.player2}
				selectedBoard={match.selectedBoard}
				showPreview={match.showPreview}
				gameOver={match.activeModal === "winner"}
				turnMoveCount={match.totalMoves}
				moveLog={match.moveLog}
				stats={match.stats}
				actions={match.actions}
				cellOwnersByBoard={match.cellOwnersByBoard}
				walletSlot={<WalletBadge coins={match.coins} xp={match.xp} />}
				onSelectBoard={match.setSelectedBoard}
				onTogglePreviewBoard={match.onSelectPreviewBoard}
				onMakeMove={match.handleMove}
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
				onConfirm={(boards, size) => {
					match.handleBoardConfigChange(boards, size);
					match.closeModal();
				}}
				onCancel={match.closeModal}
			/>
			<DifficultyModal
				visible={match.activeModal === "difficulty"}
				onSelect={(level) => {
					match.handleDifficultyChange(level);
					match.closeModal();
				}}
				onClose={match.closeModal}
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
		</>
	);
}
