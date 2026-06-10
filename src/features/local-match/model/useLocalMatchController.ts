"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isBoardDead } from "@/entities/game/lib/rules";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
	MoveLogEntry,
} from "@/entities/game/model/types";
import { useGlobalModal } from "@/features/manage-global-modal/model/globalModalStore";
import {
	playMoveSound,
	playWinSound,
} from "@/features/play-game-audio/lib/sounds";
import { useSound } from "@/features/play-game-audio/model/soundStore";
import { useShortcut } from "@/features/use-keyboard-shortcuts/model/useShortcut";
import { formatElapsedTime } from "@/shared/lib/time";

interface MatchAction {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "primary" | "default" | "danger";
}

export function useLocalMatchController() {
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [player1Name, setPlayer1Name] = useState("Player 1");
	const [player2Name, setPlayer2Name] = useState("Player 2");
	const [winner, setWinner] = useState("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [gameStarted, setGameStarted] = useState(false);
	const [initialSetupDone, setInitialSetupDone] = useState(false);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);
	const [selectedBoard, setSelectedBoard] = useState(0);
	const [showPreview, setShowPreview] = useState(false);
	const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
	const startTimeRef = useRef(Date.now());
	const [elapsed, setElapsed] = useState(0);

	const { activeModal, openModal, closeModal } = useGlobalModal();
	const { sfxMute } = useSound();
	const router = useRouter();

	useEffect(() => {
		openModal("names");
	}, [openModal]);

	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, [gameStarted]);

	useShortcut(
		{
			escape: () => {
				if ((!initialSetupDone && !gameStarted) || activeModal === "winner") {
					return;
				}
				if (activeModal) return closeModal();
			},
			m: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "exitConfirmation"
					? closeModal()
					: openModal("exitConfirmation");
			},
			r: () => {
				if (!initialSetupDone || !hasMoveHappened || activeModal === "winner") {
					return;
				}
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

	const makeMove = (boardIndex: number, cellIndex: number) => {
		setShowPreview(false);
		if (!hasMoveHappened) {
			setHasMoveHappened(true);
		}
		if (
			boards[boardIndex][cellIndex] !== "" ||
			isBoardDead(boards[boardIndex], boardSize)
		) {
			return;
		}

		const newBoards = boards.map((board, idx) =>
			idx === boardIndex
				? [...board.slice(0, cellIndex), "X", ...board.slice(cellIndex + 1)]
				: [...board],
		);
		playMoveSound(sfxMute);
		setBoards(newBoards);
		setMoveLog((prev) => [
			...prev,
			{ player: currentPlayer, board: boardIndex, cell: cellIndex },
		]);

		if (newBoards.every((board) => isBoardDead(board, boardSize))) {
			const winnerNum = currentPlayer === 1 ? 2 : 1;
			setWinner(winnerNum === 1 ? player1Name : player2Name);
			openModal("winner");
			playWinSound(sfxMute);
			return;
		}

		setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
	};

	const resetGame = (num: BoardNumber, size: BoardSize) => {
		const initialBoards = Array(num)
			.fill(null)
			.map(() => Array(size * size).fill(""));
		setBoards(initialBoards);
		setCurrentPlayer(1);
		closeModal();
		setHasMoveHappened(false);
		setSelectedBoard(0);
		setShowPreview(false);
		setMoveLog([]);
		startTimeRef.current = Date.now();
		setElapsed(0);
	};

	const handleBoardConfigChange = (num: BoardNumber, size: BoardSize) => {
		setNumberOfBoards(num);
		setBoardSize(size);
		closeModal();
		resetGame(num, size);
	};

	const submitPlayerNames = (name1: string, name2: string) => {
		setPlayer1Name(name1 || "Player 1");
		setPlayer2Name(name2 || "Player 2");
		closeModal();
		resetGame(numberOfBoards, boardSize);
		setInitialSetupDone(true);
		setGameStarted(true);
	};

	const playAgain = () => {
		closeModal();
		resetGame(numberOfBoards, boardSize);
	};

	const goToMenu = () => {
		closeModal();
		router.push("/");
	};

	const cellOwnersByBoard: Record<number, Record<number, 1 | 2>> = {};
	for (const entry of moveLog) {
		if (!cellOwnersByBoard[entry.board]) {
			cellOwnersByBoard[entry.board] = {};
		}
		cellOwnersByBoard[entry.board][entry.cell] = entry.player;
	}

	const p1MoveCount = moveLog.filter((move) => move.player === 1).length;
	const p2MoveCount = moveLog.filter((move) => move.player === 2).length;
	const aliveCount = boards.filter(
		(board) => !isBoardDead(board, boardSize),
	).length;

	const actions: MatchAction[] = [
		...(boards.length > 1
			? [
					{
						label: showPreview ? "BACK" : "PREVIEW ALL",
						onClick: () => setShowPreview((prev) => !prev),
						variant: "primary" as const,
					},
				]
			: []),
		{
			label: "RESIGN",
			onClick: () => openModal("exitConfirmation"),
			variant: "danger",
		},
	];

	return {
		activeModal,
		closeModal,
		boards,
		boardSize,
		numberOfBoards,
		currentPlayer,
		player1Name,
		player2Name,
		winner,
		initialSetupDone,
		selectedBoard,
		showPreview,
		moveLog,
		cellOwnersByBoard,
		actions,
		stats: [
			{ label: "TOTAL MOVES", value: moveLog.length },
			{ label: "BOARDS ALIVE", value: aliveCount },
			{ label: "TIME", value: formatElapsedTime(elapsed) },
		],
		player1: {
			name: player1Name,
			moveCount: p1MoveCount,
		},
		player2: {
			name: player2Name,
			moveCount: p2MoveCount,
		},
		setSelectedBoard,
		onSelectPreviewBoard: (index: number) => {
			setSelectedBoard(index);
			setShowPreview(false);
		},
		makeMove,
		submitPlayerNames,
		handleBoardConfigChange,
		playAgain,
		goToMenu,
		confirmReset: () => {
			resetGame(numberOfBoards, boardSize);
			closeModal();
		},
		confirmExit: () => {
			router.push("/");
		},
	};
}
