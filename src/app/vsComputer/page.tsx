"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useShortcut } from "@/components/hooks/useShortcut";
import Board from "@/components/ui/Board/Board";
import BoardDisplay from "@/components/ui/Game/BoardDisplay";
import BoardPreviewGrid from "@/components/ui/Game/BoardPreviewGrid";
import BoardSelector from "@/components/ui/Game/BoardSelector";
import GameActionBar from "@/components/ui/Game/GameActionBar";
import GameCenterColumn from "@/components/ui/Game/GameCenterColumn";
import GameContentArea from "@/components/ui/Game/GameContentArea";
import GameLeftPanel from "@/components/ui/Game/GameLeftPanel";
import GameStatsPanel from "@/components/ui/Game/GameStatsPanel";
import type { MoveLogEntry } from "@/components/ui/Game/GameTopBar";
import GameTopBar, { GameStatusBar } from "@/components/ui/Game/GameTopBar";
import WalletBadge from "@/components/ui/Game/WalletBadge";
import GameLayout from "@/components/ui/Layout/GameLayout";
import { TOAST_IDS } from "@/constants/toast";
import BoardConfigModal from "@/modals/BoardConfigModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import DifficultyModal from "@/modals/DifficultyModal";
import WinnerModal from "@/modals/WinnerModal";
import {
	createGame,
	getWallet,
	makeMove,
	quitGame,
	skipMove,
	undoMove,
} from "@/services/game-apis";
import { useGlobalModal } from "@/services/globalModal";
import { convertBoard, isBoardDead } from "@/services/logic";
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

/** Count total X marks across all boards */
function countTotalMoves(boards: BoardState[]): number {
	let count = 0;
	for (const board of boards) {
		for (const cell of board) {
			if (cell === "X") count++;
		}
	}
	return count;
}

const Game = () => {
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [, setGameHistory] = useState<BoardState[][]>([]);
	const [currentPlayer, setCurrentPlayer] = useState<number>(1);
	const [winner, setWinner] = useState<string>("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [_isProcessingPayment, _setIsProcessingPayment] =
		useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
	const sessionIdRef = useRef<string>("");

	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const hasInitializedRef = useRef(false);
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
	const startTimeRef = useRef<number>(Date.now());
	const [elapsed, setElapsed] = useState(0);

	const { activeModal, openModal, closeModal } = useGlobalModal();

	const { sfxMute } = useSound();
	const Coins = useCoins((state) => state.coins);
	const setCoins = useCoins((state) => state.setCoins);
	const setXP = useXP((state) => state.setXP);
	const XP = useXP((state) => state.XP);
	const user = useUser((state) => state.user);
	const router = useRouter();

	// Elapsed time tracker
	useEffect(() => {
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

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
			await initGame(numberOfBoards, boardSize, difficulty);
			if (cancelled) return;
			hasInitializedRef.current = true;
		};

		void init();

		return () => {
			cancelled = true;
		};
	}, [authReady, user]);

	const playerMoveCount = moveLog.filter((m) => m.player === 1).length;
	const cpuMoveCount = moveLog.filter((m) => m.player === 2).length;
	const totalMoves = countTotalMoves(boards);
	const aliveCount = boards.filter((b) => !isBoardDead(b, boardSize)).length;

	// Build per-board cell ownership maps from moveLog
	const cellOwnersByBoard: Record<number, Record<number, 1 | 2>> = {};
	for (const entry of moveLog) {
		if (!cellOwnersByBoard[entry.board]) {
			cellOwnersByBoard[entry.board] = {};
		}
		cellOwnersByBoard[entry.board][entry.cell] = entry.player;
	}

	const lastMove = moveLog.length > 0 ? moveLog[moveLog.length - 1] : null;

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
				currentPlayer={currentPlayer as 1 | 2}
				boards={boards}
				boardSize={boardSize}
				gameOver={activeModal === "winner"}
				mode="vsComputer"
			/>

			<GameContentArea>
				<GameLeftPanel topSlot={<WalletBadge coins={Coins} xp={XP} />}>
					<BoardSelector
						boards={boards}
						boardSize={boardSize}
						selectedBoard={selectedBoard}
						onSelectBoard={setSelectedBoard}
					/>
				</GameLeftPanel>

				<GameCenterColumn
					mobileBoardSelector={
						!showPreview ? (
							<BoardSelector
								boards={boards}
								boardSize={boardSize}
								selectedBoard={selectedBoard}
								onSelectBoard={setSelectedBoard}
							/>
						) : undefined
					}>
					<GameStatusBar
						currentPlayer={currentPlayer as 1 | 2}
						moveCount={totalMoves}
						gameOver={activeModal === "winner"}
						mode="vsComputer"
						player1Name="You"
						player2Name="CPU"
					/>
					{showPreview ? (
						<BoardPreviewGrid
							boards={boards}
							boardSize={boardSize}
							moveLog={moveLog}
							onSelectBoard={(index) => {
								setSelectedBoard(index);
								setShowPreview(false);
							}}
						/>
					) : (
						<BoardDisplay visible={boards.length > 0 && !!boards[selectedBoard]}>
							{boards[selectedBoard] && (
								<Board
									boardIndex={selectedBoard}
									boardState={boards[selectedBoard]}
									makeMove={handleMove}
									isDead={isBoardDead(boards[selectedBoard], boardSize)}
									boardSize={boardSize}
									cellOwners={cellOwnersByBoard[selectedBoard]}
									lastMoveCell={lastMove?.board === selectedBoard ? lastMove.cell : undefined}
								/>
							)}
						</BoardDisplay>
					)}
				</GameCenterColumn>

				<GameStatsPanel
					stats={[
						{ label: "TOTAL MOVES", value: totalMoves },
						{ label: "BOARDS ALIVE", value: aliveCount },
						{ label: "TIME", value: formatTime(elapsed) },
					]}
					moveLog={moveLog}
					boardSize={boardSize}
				/>
			</GameContentArea>

			{/* Sticky action bar */}
			<GameActionBar
				actions={[
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
						label: `UNDO (${100})`,
						onClick: handleUndo,
						disabled: Coins < 100 || isUndoing || !hasMoveHappened,
					},
					{
						label: `SKIP (${200})`,
						onClick: handleSkip,
						disabled: Coins < 200 || isSkipping,
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
				winner={winner}
				onPlayAgain={() => {
					closeModal();
					handleReset();
				}}
				onMenu={() => {
					closeModal();
					router.push("/");
				}}
			/>

			<BoardConfigModal
				visible={activeModal === "boardConfig"}
				currentBoards={numberOfBoards}
				currentSize={boardSize}
				onConfirm={(boards, size) => {
					handleBoardConfigChange(boards, size);
					closeModal();
				}}
				onCancel={closeModal}
			/>
			<DifficultyModal
				visible={activeModal === "difficulty"}
				onSelect={(level: DifficultyLevel) => {
					handleDifficultyChange(level);
					closeModal();
				}}
				onClose={closeModal}
			/>
			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					handleReset();
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
