import { useEffect, useRef, useState } from "react";
import type { MoveLogEntry } from "@/components/ui/Game/GameTopBar";
import { applyMove, createInitialBoards } from "@/services/gameLogic";
import { useGlobalModal } from "@/services/globalModal";
import { isBoardDead } from "@/services/logic";
import { playMoveSound, playWinSound } from "@/services/sounds";
import { useSound } from "@/services/store";
import type { BoardNumber, BoardSize, BoardState } from "@/services/types";

export const useVsPlayerGame = () => {
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [showPreview, setShowPreview] = useState(false);
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
	const [winner, setWinner] = useState<1 | 2 | null>(null);
	const [selectedBoard, setSelectedBoard] = useState(0);
	const [elapsed, setElapsed] = useState(0);
	const startTimeRef = useRef<number>(Date.now());

	const { sfxMute } = useSound();
	const { closeModal, openModal } = useGlobalModal();

	// Elapsed time tracker
	useEffect(() => {
		if (!hasMoveHappened) return;
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, [hasMoveHappened]);

	const makeMoveHandler = (boardIndex: number, cellIndex: number) => {
		setShowPreview(false);
		if (!hasMoveHappened) {
			setHasMoveHappened(true);
		}
		if (
			boards[boardIndex][cellIndex] !== "" ||
			isBoardDead(boards[boardIndex], boardSize)
		)
			return;

		const newBoards = applyMove(boards, boardIndex, cellIndex);

		playMoveSound(sfxMute);
		setBoards(newBoards);

		setMoveLog((prev) => [
			...prev,
			{ player: currentPlayer, board: boardIndex, cell: cellIndex },
		]);

		if (newBoards.every((board) => isBoardDead(board, boardSize))) {
			const loser = currentPlayer;
			const winnerNum: 1 | 2 = loser === 1 ? 2 : 1;
			setWinner(winnerNum);
			openModal("winner");
			playWinSound(sfxMute);
			return;
		}

		setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
	};

	const resetGame = (num: BoardNumber, size: BoardSize) => {
		const initialBoards = createInitialBoards(num, size);

		setBoards(initialBoards);
		setCurrentPlayer(1);
		closeModal();
		setHasMoveHappened(false);
		setSelectedBoard(0);
		setMoveLog([]);
		startTimeRef.current = Date.now();
		setElapsed(0);
	};

	const handleBoardConfigChange = (num: BoardNumber, size: BoardSize) => {
		setNumberOfBoards(num);
		setBoardSize(size as BoardSize);
		closeModal();
		resetGame(num, size);
	};

	return {
		boards,
		boardSize,
		currentPlayer,
		winner,
		numberOfBoards,
		hasMoveHappened,
		moveLog,
		makeMoveHandler,
		resetGame,
		handleBoardConfigChange,
		setBoardSize,
		setNumberOfBoards,
		setWinner,
		showPreview,
		setShowPreview,
		selectedBoard,
		setSelectedBoard,
		elapsed,
		setElapsed,
		startTimeRef,
	};
};
