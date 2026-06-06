"use client";

import { useLocalMatchController } from "@/features/local-match/model/useLocalMatchController";
import BoardConfigModal from "@/widgets/board-config-modal/ui/BoardConfigModal";
import ConfirmationModal from "@/widgets/confirmation-modal/ui/ConfirmationModal";
import GameScreen from "@/widgets/game-screen/ui/GameScreen";
import PlayerNamesModal from "@/widgets/player-names-modal/ui/PlayerNamesModal";
import WinnerModal from "@/widgets/winner-modal/ui/WinnerModal";

export default function VsPlayerGameScreen() {
	const match = useLocalMatchController();

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
				onSelectBoard={match.setSelectedBoard}
				onTogglePreviewBoard={match.onSelectPreviewBoard}
				onMakeMove={match.makeMove}
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
		</>
	);
}
