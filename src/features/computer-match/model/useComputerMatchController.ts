"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type {
	MakeMoveResponse,
	SkipMoveResponse,
	UndoMoveResponse,
} from "@/entities/game/api/schema";
import {
	convertBoard,
	convertCellOwners,
	isBoardDead,
} from "@/entities/game/lib/rules";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
	DifficultyLevel,
	ErrorResponse,
	MoveLogEntry,
	NewGameResponse,
} from "@/entities/game/model/types";
import {
	useCoins,
	useSound,
	useUser,
	useXP,
} from "@/features/app-state/model/stores";
import {
	createGame,
	getWallet,
	makeMove,
	quitGame,
	skipMove,
	undoMove,
} from "@/features/backend-game/api/gameApis";
import { useGlobalModal } from "@/features/manage-global-modal/model/globalModalStore";
import {
	playMoveSound,
	playWinSound,
} from "@/features/play-game-audio/lib/sounds";
import { TOAST_IDS } from "@/features/show-toast-with-cooldown/model/toast";
import { useShortcut } from "@/features/use-keyboard-shortcuts/model/useShortcut";
import { formatElapsedTime } from "@/shared/lib/time";

interface MatchAction {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "primary" | "default" | "danger";
}

function countTotalMoves(boards: BoardState[]): number {
	let count = 0;
	for (const board of boards) {
		for (const cell of board) {
			if (cell === "X") count++;
		}
	}
	return count;
}

export function useComputerMatchController() {
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [, setGameHistory] = useState<BoardState[][]>([]);
	const [currentPlayer, setCurrentPlayer] = useState<number>(1);
	const [winner, setWinner] = useState("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
	const sessionIdRef = useRef("");

	const [isProcessing, setIsProcessing] = useState(false);
	const hasInitializedRef = useRef(false);
	const [isResetting, setIsResetting] = useState(false);
	const [isUndoing, setIsUndoing] = useState(false);
	const [isSkipping, setIsSkipping] = useState(false);
	const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);
	const [isUpdatingDifficulty, setIsUpdatingDifficulty] = useState(false);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);
	const [selectedBoard, setSelectedBoard] = useState(0);
	const [showPreview, setShowPreview] = useState(false);
	const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
	const [cellOwnersByBoard, setCellOwnersByBoard] = useState<
		Record<number, Record<number, 1 | 2>>
	>({});
	const startTimeRef = useRef(Date.now());
	const [elapsed, setElapsed] = useState(0);

	const { activeModal, openModal, closeModal } = useGlobalModal();
	const { sfxMute } = useSound();
	const coins = useCoins((state) => state.coins);
	const setCoins = useCoins((state) => state.setCoins);
	const xp = useXP((state) => state.XP);
	const setXP = useXP((state) => state.setXP);
	const user = useUser((state) => state.user);
	const authReady = useUser((state) => state.authReady);
	const router = useRouter();

	useEffect(() => {
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

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
				if (activeModal === "winner" || !hasMoveHappened) return;
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

	const syncWallet = async (token: string) => {
		const wallet = await getWallet(token);
		if (wallet.success) {
			setCoins(wallet.coins);
			setXP(wallet.xp);
		}
	};

	const initGame = async (
		num: BoardNumber,
		size: BoardSize,
		diff: DifficultyLevel,
	) => {
		try {
			if (!user) {
				console.log("initGame: user not authenticated");
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await createGame(num, size, diff, await user.getIdToken());
			if (!data || (data as ErrorResponse).success === false) {
				const err = (data as ErrorResponse) ?? {
					success: false,
					error: "Unknown error",
				};
				toast.error(`Failed to create game: ${err.error}`);
				return;
			}

			const resp = data as NewGameResponse;
			let newBoards: BoardState[];
			try {
				newBoards = convertBoard(
					resp.boards,
					resp.numberOfBoards,
					resp.boardSize,
				);
			} catch (error) {
				toast.error(`Failed to initialize game boards: ${error}`);
				return;
			}

			if (newBoards.length === 0) {
				toast.error("Failed to initialize game boards");
				return;
			}
			sessionIdRef.current = resp.sessionId;
			setBoards(newBoards);
			setCurrentPlayer(1);
			setBoardSize(resp.boardSize);
			setNumberOfBoards(resp.numberOfBoards);
			setDifficulty(resp.difficulty);
			setGameHistory([newBoards]);
			setMoveLog([]);
			setSelectedBoard(0);
			setShowPreview(false);
			setCellOwnersByBoard(
				resp.isAiMove
					? convertCellOwners(
							resp.boards,
							resp.isAiMove,
							resp.numberOfBoards,
							resp.boardSize,
						)
					: {},
			);
			startTimeRef.current = Date.now();
			setElapsed(0);
			setHasMoveHappened(countTotalMoves(newBoards) > 0);
		} catch (error) {
			toast.error(`Error initializing game: ${error}`);
			router.push("/");
		}
	};

	const blockedByPendingOperation = () =>
		isProcessing ||
		isUpdatingConfig ||
		isUpdatingDifficulty ||
		isResetting ||
		isUndoing ||
		isSkipping;

	const handleMove = async (boardIndex: number, cellIndex: number) => {
		if (blockedByPendingOperation()) return;
		setIsProcessing(true);
		setShowPreview(false);
		if (!hasMoveHappened) {
			setHasMoveHappened(true);
		}
		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await makeMove(
				sessionIdRef.current,
				boardIndex,
				cellIndex,
				await user.getIdToken(),
			);
			if (!data || (data as ErrorResponse).success === false) {
				const err = (data as ErrorResponse) ?? {
					success: false,
					error: "Unknown error",
				};
				toast.error(`Failed to make move: ${err.error}`);
				return;
			}
			const resp = data as MakeMoveResponse;
			let newBoards: BoardState[];
			try {
				newBoards = convertBoard(resp.boards, numberOfBoards, boardSize);
			} catch (error) {
				toast.error(`Failed to initialize game boards: ${error}`);
				return;
			}

			if (newBoards.length === 0) {
				toast.error("Failed to initialize game boards");
				return;
			}

			const afterPlayer = boards.map((board, idx) =>
				idx === boardIndex
					? [...board.slice(0, cellIndex), "X", ...board.slice(cellIndex + 1)]
					: [...board],
			);
			let cpuBoard = -1;
			let cpuCell = -1;
			for (let b = 0; b < newBoards.length; b++) {
				for (let c = 0; c < newBoards[b].length; c++) {
					if (newBoards[b][c] !== afterPlayer[b][c]) {
						cpuBoard = b;
						cpuCell = c;
						break;
					}
				}
				if (cpuBoard >= 0) break;
			}

			setMoveLog((prev) => {
				const updated: MoveLogEntry[] = [
					...prev,
					{ player: 1, board: boardIndex, cell: cellIndex },
				];
				if (cpuBoard >= 0) {
					updated.push({ player: 2, board: cpuBoard, cell: cpuCell });
				}
				return updated;
			});

			if (cpuBoard >= 0) {
				setSelectedBoard(cpuBoard);
			}

			setBoards(newBoards);
			if (resp.isAiMove) {
				setCellOwnersByBoard(
					convertCellOwners(
						resp.boards,
						resp.isAiMove,
						numberOfBoards,
						boardSize,
					),
				);
			}
			setCurrentPlayer(1);
			setGameHistory((prev) => [...prev, newBoards]);
			if (resp.gameover) {
				const token = await user.getIdToken();
				await syncWallet(token);
				setWinner(resp.winner === true ? "You" : "Computer");
				openModal("winner");
				playWinSound(sfxMute);
			} else {
				playMoveSound(sfxMute);
			}
		} catch (error) {
			toast.error(`Error making move ${error}`);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleReset = async () => {
		if (blockedByPendingOperation()) return;
		setIsResetting(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(
				sessionIdRef.current,
				await user.getIdToken(),
			);
			console.log(data);
			if (!data.success) {
				toast.error("Failed to reset game");
				return;
			}
			await initGame(numberOfBoards, boardSize, difficulty);
		} catch (error) {
			toast.error(`Error resetting game ${error}`);
		} finally {
			setIsResetting(false);
		}
	};

	const handleUndo = async () => {
		if (blockedByPendingOperation()) return;
		if (coins < 100) {
			toast.error("Not enough coins");
			return;
		}
		setIsUndoing(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}
			const data = await undoMove(
				sessionIdRef.current,
				await user.getIdToken(),
			);
			if (!data || (data as ErrorResponse).success === false) {
				const err = (data as ErrorResponse) ?? {
					success: false,
					error: "Unknown error",
				};
				toast.error(`Failed to undo move: ${err.error}`);
				return;
			}
			const resp = data as UndoMoveResponse;
			let newBoards: BoardState[];
			try {
				newBoards = convertBoard(resp.boards, numberOfBoards, boardSize);
			} catch (error) {
				toast.error(`Failed to initialize game boards: ${error}`);
				return;
			}

			if (newBoards.length === 0) {
				toast.error("Failed to initialize game boards");
				return;
			}
			setBoards(newBoards);
			if (resp.isAiMove) {
				setCellOwnersByBoard(
					convertCellOwners(
						resp.boards,
						resp.isAiMove,
						numberOfBoards,
						boardSize,
					),
				);
			}
			setCurrentPlayer(1);
			setGameHistory((prev) => [...prev, newBoards]);

			const remainingMoves = countTotalMoves(newBoards);
			setMoveLog((prev) => prev.slice(0, remainingMoves));
			setHasMoveHappened(remainingMoves > 0);
			await syncWallet(await user.getIdToken());
		} catch (error) {
			toast.error(`Error undoing move: ${error}`);
		} finally {
			setIsUndoing(false);
		}
	};

	const handleSkip = async () => {
		if (blockedByPendingOperation()) return;
		if (coins < 200) {
			toast.error("Not enough coins");
			return;
		}
		setIsSkipping(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}
			const data = await skipMove(
				sessionIdRef.current,
				await user.getIdToken(),
			);
			if (!data || (data as ErrorResponse).success === false) {
				const err = (data as ErrorResponse) ?? {
					success: false,
					error: "Unknown error",
				};
				toast.error(`Failed to skip move: ${err.error}`);
				return;
			}
			const resp = data as SkipMoveResponse;
			let newBoards: BoardState[];
			try {
				newBoards = convertBoard(resp.boards, numberOfBoards, boardSize);
			} catch (error) {
				toast.error(`Failed to initialize game boards: ${error}`);
				return;
			}

			if (newBoards.length === 0) {
				toast.error("Failed to initialize game boards");
				return;
			}

			let cpuBoard = -1;
			let cpuCell = -1;
			for (let b = 0; b < newBoards.length; b++) {
				for (let c = 0; c < newBoards[b].length; c++) {
					if (newBoards[b][c] !== boards[b]?.[c]) {
						cpuBoard = b;
						cpuCell = c;
						break;
					}
				}
				if (cpuBoard >= 0) break;
			}

			if (cpuBoard >= 0) {
				setMoveLog((prev) => [
					...prev,
					{ player: 2, board: cpuBoard, cell: cpuCell },
				]);
				setSelectedBoard(cpuBoard);
			}

			if (!hasMoveHappened) {
				setHasMoveHappened(true);
			}

			setBoards(newBoards);
			if (resp.isAiMove) {
				setCellOwnersByBoard(
					convertCellOwners(
						resp.boards,
						resp.isAiMove,
						numberOfBoards,
						boardSize,
					),
				);
			}
			setCurrentPlayer(1);
			setGameHistory((prev) => [...prev, newBoards]);
			await syncWallet(await user.getIdToken());

			if (resp.gameover) {
				setWinner(resp.winner === true ? "You" : "Computer");
				openModal("winner");
				playWinSound(sfxMute);
			} else {
				playMoveSound(sfxMute);
			}
		} catch (error) {
			toast.error(`Error skipping move: ${error}`);
		} finally {
			setIsSkipping(false);
		}
	};

	const handleBoardConfigChange = async (
		newNumberOfBoards: BoardNumber,
		newBoardSize: BoardSize,
	) => {
		if (blockedByPendingOperation()) return;
		setIsUpdatingConfig(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(
				sessionIdRef.current,
				await user.getIdToken(),
			);
			console.log(data);
			if (!data.success) {
				toast.error("Failed to quit game");
				return;
			}
			await initGame(newNumberOfBoards, newBoardSize, difficulty);
		} catch (error) {
			toast.error(`Error updating config: ${error}`);
		} finally {
			setIsUpdatingConfig(false);
		}
	};

	const handleDifficultyChange = async (level: DifficultyLevel) => {
		if (blockedByPendingOperation()) return;
		setIsUpdatingDifficulty(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(
				sessionIdRef.current,
				await user.getIdToken(),
			);
			console.log(data);
			if (!data.success) {
				toast.error("Failed to quit game");
				return;
			}
			await initGame(numberOfBoards, boardSize, level);
		} catch (error) {
			toast.error(`Error updating config: ${error}`);
		} finally {
			setIsUpdatingDifficulty(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: auth readiness gates the initial backend session; the ref prevents duplicate creates.
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
			await initGame(numberOfBoards, boardSize, difficulty);
			if (cancelled) return;
			hasInitializedRef.current = true;
		};

		void init();

		return () => {
			cancelled = true;
		};
	}, [authReady, user]);

	const playerMoveCount = moveLog.filter((move) => move.player === 1).length;
	const cpuMoveCount = moveLog.filter((move) => move.player === 2).length;
	const totalMoves = countTotalMoves(boards);
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
			label: "UNDO (100)",
			onClick: handleUndo,
			disabled: coins < 100 || isUndoing || !hasMoveHappened,
		},
		{
			label: "SKIP (200)",
			onClick: handleSkip,
			disabled: coins < 200 || isSkipping,
		},
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
		difficulty,
		currentPlayer: currentPlayer as 1 | 2,
		winner,
		selectedBoard,
		showPreview,
		moveLog,
		cellOwnersByBoard,
		coins,
		xp,
		actions,
		stats: [
			{ label: "TOTAL MOVES", value: totalMoves },
			{ label: "BOARDS ALIVE", value: aliveCount },
			{ label: "TIME", value: formatElapsedTime(elapsed) },
		],
		player1: {
			name: "You",
			moveCount: playerMoveCount,
		},
		player2: {
			name: "CPU",
			moveCount: cpuMoveCount,
		},
		totalMoves,
		setSelectedBoard,
		onSelectPreviewBoard: (index: number) => {
			setSelectedBoard(index);
			setShowPreview(false);
		},
		handleMove,
		handleReset,
		handleBoardConfigChange,
		handleDifficultyChange,
		playAgain: () => {
			closeModal();
			handleReset();
		},
		goToMenu: () => {
			closeModal();
			router.push("/");
		},
		confirmReset: () => {
			handleReset();
			closeModal();
		},
		confirmExit: () => {
			router.push("/");
		},
	};
}
