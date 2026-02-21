import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { MoveLogEntry } from "@/components/ui/Game/GameTopBar";
import {
	createGame,
	getWallet,
	makeMove,
	quitGame,
	skipMove,
	undoMove,
} from "@/services/game-apis";
import { useGlobalModal } from "@/services/globalModal";
import { convertBoard, convertCellOwners } from "@/services/logic";
import type {
	MakeMoveResponse,
	SkipMoveResponse,
	UndoMoveResponse,
} from "@/services/schema";
import { playMoveSound, playWinSound } from "@/services/sounds";
import { useCoins, useSound, useUser, useXP } from "@/services/store";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
	DifficultyLevel,
	ErrorResponse,
	NewGameResponse,
} from "@/services/types";
import countTotalMoves from "@/utils/countTotalMoves";

export const useVsComputer = () => {
	const user = useUser((state) => state.user);
	const router = useRouter();

	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [_gameHistory, setGameHistory] = useState<BoardState[][]>([]);
	const [currentPlayer, setCurrentPlayer] = useState<number>(1);
	const [winner, setWinner] = useState<string>("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [_isProcessingPayment, _setIsProcessingPayment] =
		useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
	const sessionIdRef = useRef<string>("");

	const [isResetting, setIsResetting] = useState<boolean>(false);
	const [isUndoing, setIsUndoing] = useState<boolean>(false);
	const [isSkipping, setIsSkipping] = useState<boolean>(false);
	const [isUpdatingConfig, setIsUpdatingConfig] = useState<boolean>(false);
	const [isUpdatingDifficulty, setIsUpdatingDifficulty] =
		useState<boolean>(false);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);
	const [selectedBoard, setSelectedBoard] = useState(0);
	const [showPreview, setShowPreview] = useState(false);
	const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
	const [cellOwnersByBoard, setCellOwnersByBoard] = useState<
		Record<number, Record<number, 1 | 2>>
	>({});
	const startTimeRef = useRef<number>(Date.now());
	const [elapsed, setElapsed] = useState(0);

	const { openModal } = useGlobalModal();

	const { sfxMute } = useSound();
	const Coins = useCoins((state) => state.coins);
	const setCoins = useCoins((state) => state.setCoins);
	const setXP = useXP((state) => state.setXP);
	useEffect(() => {
		if (!hasMoveHappened) return;
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, [hasMoveHappened]);

	const initGame = async (
		num: BoardNumber,
		size: BoardSize,
		diff: DifficultyLevel,
	) => {
		try {
			if (user) {
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

				// If loading an existing game, check if moves already exist
				const existingMoves = countTotalMoves(newBoards);
				setHasMoveHappened(existingMoves > 0);
			} else {
				console.log("initGame: user not authenticated");
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error(`Error initializing game: ${error}`);
			router.push("/");
		}
	};

	const handleMove = async (boardIndex: number, cellIndex: number) => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		setIsProcessing(true);
		setShowPreview(false);
		if (!hasMoveHappened) {
			setHasMoveHappened(true);
		}
		try {
			if (user) {
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

				// Detect CPU's move by comparing boards after player's move with API result
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

				// Log player move + CPU move
				setMoveLog((prev) => {
					const updated = [
						...prev,
						{ player: 1 as const, board: boardIndex, cell: cellIndex },
					];
					if (cpuBoard >= 0) {
						updated.push({
							player: 2 as const,
							board: cpuBoard,
							cell: cpuCell,
						});
					}
					return updated;
				});

				// Auto-switch to the board the CPU moved on
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
					const wallet = await getWallet(token);

					if (wallet.success) {
						setCoins(wallet.coins);
						setXP(wallet.xp);
					}
					if (resp.winner === true) {
						setWinner("You");
					} else {
						setWinner("Computer");
					}
					openModal("winner");
					playWinSound(sfxMute);
				} else {
					playMoveSound(sfxMute);
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error(`Error making move ${error}`);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleReset = async () => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
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
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		if (Coins < 100) {
			toast.error("Not enough coins");
			return;
		}
		setIsUndoing(true);

		try {
			if (user) {
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

				// Sync moveLog with board state (source of truth)
				const remainingMoves = countTotalMoves(newBoards);
				setMoveLog((prev) => prev.slice(0, remainingMoves));
				setHasMoveHappened(remainingMoves > 0);

				const token = await user.getIdToken();
				const wallet = await getWallet(token);

				if (wallet.success) {
					setCoins(wallet.coins);
					setXP(wallet.xp);
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error(`Error undoing move: ${error}`);
		} finally {
			setIsUndoing(false);
		}
	};

	const handleSkip = async () => {
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
		if (Coins < 200) {
			toast.error("Not enough coins");
			return;
		}
		setIsSkipping(true);

		try {
			if (user) {
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

				// Detect CPU's move by comparing boards before/after skip
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
						{ player: 2 as const, board: cpuBoard, cell: cpuCell },
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
				const token = await user.getIdToken();
				const wallet = await getWallet(token);

				if (wallet.success) {
					setCoins(wallet.coins);
					setXP(wallet.xp);
				}
				if (resp.gameover) {
					if (resp.winner === true) {
						setWinner("You");
					} else {
						setWinner("Computer");
					}
					openModal("winner");
					playWinSound(sfxMute);
				} else {
					playMoveSound(sfxMute);
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
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
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
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
		if (
			isProcessing ||
			isUpdatingConfig ||
			isUpdatingDifficulty ||
			isResetting ||
			isUndoing ||
			isSkipping
		) {
			return;
		}
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

	return {
		boards,
		boardSize,
		numberOfBoards,
		difficulty,
		selectedBoard,
		showPreview,
		moveLog,
		winner,
		elapsed,
		hasMoveHappened,
		currentPlayer,
		cellOwnersByBoard,
		isUndoing,
		isSkipping,
		setShowPreview,
		setSelectedBoard,
		initGame,
		handleMove,
		handleUndo,
		handleSkip,
		handleReset,
		handleBoardConfigChange,
		handleDifficultyChange,
	};
};
