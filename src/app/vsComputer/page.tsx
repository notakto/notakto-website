"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useShortcut } from "@/components/hooks/useShortcut";
import Board from "@/components/ui/Board/Board";
import SettingBar from "@/components/ui/Buttons/SettingBar";
import { SettingButton } from "@/components/ui/Buttons/SettingButton";
import BoardContainer from "@/components/ui/Containers/Board/BoardContainer";
import BoardWrapper from "@/components/ui/Containers/Board/BoardWrapper";
import GameBoardArea from "@/components/ui/Containers/Games/GameBoardArea";
import PlayerStatusContainer from "@/components/ui/Containers/Games/PlayerStatusContainer";
import StatContainer from "@/components/ui/Containers/Games/StatContainer";
import SettingContainer from "@/components/ui/Containers/Settings/SettingContainer";
import SettingOverlay from "@/components/ui/Containers/Settings/SettingOverlay";
import GameLayout from "@/components/ui/Layout/GameLayout";
import PlayerTurnTitle from "@/components/ui/Title/PlayerTurnTitle";
import StatLabel from "@/components/ui/Title/StatLabel";
import BoardConfigModal from "@/modals/BoardConfigModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import DifficultyModal from "@/modals/DifficultyModal";
import ShortcutModal from "@/modals/ShortcutModal";
import SoundConfigModal from "@/modals/SoundConfigModal";
import WinnerModal from "@/modals/WinnerModal";
import {
	createGame,
	createSession,
	makeMove,
	quitGame,
	skipMove,
	undoMove,
} from "@/services/game-apis";
import { convertBoard, isBoardDead } from "@/services/logic";
import type { MakeMoveResponse } from "@/services/schema";
import { playMoveSound, playWinSound } from "@/services/sounds";
import { useCoins, useSound, useUser, useXP } from "@/services/store";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
	ComputerButtonModalType,
	DifficultyLevel,
	ErrorResponse,
	NewGameResponse,
} from "@/services/types";

const Game = () => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [, setGameHistory] = useState<BoardState[][]>([]);
	const [currentPlayer, setCurrentPlayer] = useState<number>(1);
	const [winner, setWinner] = useState<string>("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [isProcessingPayment, _setIsProcessingPayment] =
		useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
	const [sessionId, setSessionId] = useState<string>("");

	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const hasInitializedRef = useRef(false);
	const [isResetting, setIsResetting] = useState<boolean>(false);
	const [isUndoing, setIsUndoing] = useState<boolean>(false);
	const [isSkipping, setIsSkipping] = useState<boolean>(false);
	const [isUpdatingConfig, setIsUpdatingConfig] = useState<boolean>(false);
	const [isUpdatingDifficulty, setIsUpdatingDifficulty] =
		useState<boolean>(false);
	const [activeModal, setActiveModal] = useState<ComputerButtonModalType>(null);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);

	const { sfxMute } = useSound();
	const Coins = useCoins((state) => state.coins);
	const setCoins = useCoins((state) => state.setCoins);
	const setXP = useXP((state) => state.setXP);
	const XP = useXP((state) => state.XP);
	const user = useUser((state) => state.user);
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	// const { canShowToast, resetCooldown } = useToastCooldown(TOAST_DURATION);
	const router = useRouter();

	useShortcut(
		{
			escape: () => {
				if (activeModal === "winner") return;

				if (activeModal) return setActiveModal(null);
				return setIsMenuOpen(false);
			},

			m: () => {
				if (activeModal === "winner") return;
				setActiveModal((prev) =>
					prev === "exitConfirmation" ? null : "exitConfirmation",
				);
			},

			r: () => {
				if (activeModal === "winner" || !hasMoveHappened) return;
				setActiveModal((prev) =>
					prev === "resetConfirmation" ? null : "resetConfirmation",
				);
			},

			c: () => {
				if (activeModal === "winner") return;
				setActiveModal((prev) =>
					prev === "boardConfig" ? null : "boardConfig",
				);
			},

			s: () => {
				if (activeModal === "winner") return;
				setActiveModal((prev) =>
					prev === "soundConfig" ? null : "soundConfig",
				);
			},

			d: () => {
				if (activeModal === "winner") return;
				setActiveModal((prev) => (prev === "difficulty" ? null : "difficulty"));
			},

			q: () => {
				if (activeModal === "winner") return;
				setActiveModal((prev) => (prev === "shortcut" ? null : "shortcut"));
			},
		},
		isMenuOpen,
	);

	const initGame = async (
		num: BoardNumber,
		size: BoardSize,
		diff: DifficultyLevel,
	) => {
		try {
			if (user) {
				const data = await createGame(num, size, diff, await user.getIdToken());
				// handle API-level errors (ErrorResponse)
				if (!data || (data as ErrorResponse).success === false) {
					const err = (data as ErrorResponse) ?? {
						success: false,
						error: "Unknown error",
					};
					toast.error(`Failed to create game: ${err.error}`);
					return;
				}

				// At this point `data` is NewGameResponse
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
				const res = await createSession(
					resp.sessionId,
					newBoards,
					resp.numberOfBoards,
					resp.boardSize,
					resp.difficulty,
					await user.getIdToken(),
				);
				if (!res || (res as ErrorResponse).success === false) {
					const err = (res as ErrorResponse) ?? {
						success: false,
						error: "Unknown error",
					};
					toast.error(`Failed to register action : ${err.error}`);
					return;
				}
				setSessionId(resp.sessionId);
				setBoards(newBoards);
				setCurrentPlayer(1);
				setBoardSize(resp.boardSize);
				setNumberOfBoards(resp.numberOfBoards);
				setDifficulty(resp.difficulty);
				setGameHistory([newBoards]);
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
		if (isProcessing) return;
		setIsProcessing(true);
		if (!hasMoveHappened) {
			setHasMoveHappened(true);
		}
		try {
			if (user) {
				const data = await makeMove(
					sessionId,
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
				setBoards(newBoards);
				setCurrentPlayer(1);
				setGameHistory((prev) => [...prev, newBoards]);
				if (resp.gameover) {
					if (resp.winner === true) {
						setWinner("You");
						setCoins(Coins + resp.coinsRewarded);
					} else {
						setWinner("Computer");
					}
					setXP(XP + resp.xpRewarded);
					setActiveModal("winner");
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
		if (isResetting) return;
		setIsResetting(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(sessionId, await user.getIdToken());
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
		if (isUndoing || Coins < 100) {
			if (Coins < 100) toast.error("Not enough coins");
			return;
		}
		setIsUndoing(true);

		try {
			if (user) {
				const data = await undoMove(sessionId, await user.getIdToken());
				if (data.success) {
					setBoards(data.gameState.boards);
					setCurrentPlayer(data.gameState.currentPlayer);
					setGameHistory(data.gameState.gameHistory);
				} else if ("error" in data) {
					toast.error(data.error || "Failed to undo move");
				} else {
					toast.error("Unexpected response from server");
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
		if (isSkipping || Coins < 200) {
			if (Coins < 200) toast.error("Not enough coins");
			return;
		}
		setIsSkipping(true);

		try {
			if (user) {
				const data = await skipMove(sessionId, await user.getIdToken());
				if (data.success) {
					setBoards(data.gameState.boards);
					setCurrentPlayer(data.gameState.currentPlayer);
					setGameHistory(data.gameState.gameHistory);
					if (data.gameOver) {
						setWinner(data.gameState.winner);
						setActiveModal("winner");
						playWinSound(sfxMute);
					}
				} else if ("error" in data) {
					toast.error(data.error || "Failed to skip move");
				} else {
					toast.error("Unexpected response from server");
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
		if (isUpdatingConfig) return;
		setIsUpdatingConfig(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(sessionId, await user.getIdToken());
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
		if (isUpdatingDifficulty) return;
		setIsUpdatingDifficulty(true);

		try {
			if (!user) {
				toast.error("User not authenticated");
				router.push("/");
				return;
			}

			const data = await quitGame(sessionId, await user.getIdToken());
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <intentionally run only on mount to initialize game once>
	useEffect(() => {
		if (!authReady) return;
		if (!user) {
			toast.error("User not authenticated");
			router.push("/");
			return;
		}

		if (hasInitializedRef.current) return;
		hasInitializedRef.current = true;

		initGame(numberOfBoards, boardSize, difficulty);
	}, [authReady, user]);

	return (
		<GameLayout>
			<GameBoardArea>
				<PlayerStatusContainer>
					<StatContainer>
						<StatLabel text={`Coins: ${Coins}`} />
						<StatLabel text={`| XP: ${XP}`} />
					</StatContainer>
					<PlayerTurnTitle
						text={currentPlayer === 1 ? "Your Turn" : "Computer's Turn"}
					/>
				</PlayerStatusContainer>

				<BoardContainer>
					{boards.map((board, index) => (
						//FIXME:
						// biome-ignore lint/suspicious/noArrayIndexKey: <fix later>
						<BoardWrapper key={index}>
							<Board
								boardIndex={index}
								boardState={board}
								makeMove={handleMove}
								isDead={isBoardDead(board, boardSize)}
								boardSize={boardSize}
							/>
						</BoardWrapper>
					))}
				</BoardContainer>
				<SettingBar text={"Settings"} onClick={toggleMenu} />
			</GameBoardArea>

			{isMenuOpen && (
				<SettingOverlay>
					<SettingContainer>
						<SettingButton
							onClick={() => {
								handleReset();
								setIsMenuOpen(false);
							}}
							disabled={isResetting}
							loading={isResetting}>
							Reset
						</SettingButton>
						<SettingButton
							onClick={() => {
								setActiveModal("boardConfig");
								setIsMenuOpen(false);
							}}
							disabled={isUpdatingConfig}>
							Game Configuration
						</SettingButton>
						<SettingButton
							onClick={() => {
								handleUndo();
								setIsMenuOpen(false);
							}}
							disabled={Coins < 100 || isUndoing}
							loading={isUndoing}>
							Undo (100 coins)
						</SettingButton>
						<SettingButton
							onClick={() => {
								handleSkip();
								setIsMenuOpen(false);
							}}
							disabled={Coins < 200 || isSkipping}
							loading={isSkipping}>
							Skip a Move (200 coins)
						</SettingButton>
						<SettingButton
							//Blocking the current functions since we need it disabled until the feature comes up right
							// DO NOT DELETE THIS COMMENTS

							// onClick={() =>
							// 	handleBuyCoins(
							// 		setIsProcessingPayment,
							// 		canShowToast,
							// 		resetCooldown,
							// 		setCoins,
							// 		Coins,
							// 	)
							// }
							// disabled={isProcessingPayment}

							disabled={true} // make it gray + non-clickable
							title="Currently not available" // native tooltip
							loading={isProcessingPayment}>
							Buy Coins (100)
						</SettingButton>
						<SettingButton
							onClick={() => {
								setActiveModal("difficulty");
								setIsMenuOpen(false);
							}}>
							AI Level: {difficulty}
						</SettingButton>
						<SettingButton
							onClick={() => {
								setActiveModal("soundConfig");
								setIsMenuOpen(false);
							}}>
							Adjust Sound
						</SettingButton>
						<SettingButton onClick={() => router.push("/")}>
							Main Menu
						</SettingButton>
						<SettingButton onClick={toggleMenu}>Return to Game</SettingButton>
						<SettingButton
							onClick={() => {
								setActiveModal("shortcut");
								setIsMenuOpen(false);
							}}>
							Keyboard Shortcuts
						</SettingButton>
					</SettingContainer>
				</SettingOverlay>
			)}

			<WinnerModal
				visible={activeModal === "winner"}
				winner={winner}
				onPlayAgain={() => {
					setActiveModal(null);
					handleReset();
				}}
				onMenu={() => {
					setActiveModal(null);
					router.push("/");
				}}
			/>

			<BoardConfigModal
				visible={activeModal === "boardConfig"}
				currentBoards={numberOfBoards}
				currentSize={boardSize}
				onConfirm={handleBoardConfigChange}
				onCancel={() => setActiveModal(null)}
			/>
			<ShortcutModal
				visible={activeModal === "shortcut"}
				onClose={() => setActiveModal(null)}
			/>
			<DifficultyModal
				visible={activeModal === "difficulty"}
				onSelect={(level: DifficultyLevel) => {
					handleDifficultyChange(level);
					setActiveModal(null);
				}}
				onClose={() => setActiveModal(null)}
			/>
			<SoundConfigModal
				visible={activeModal === "soundConfig"}
				onClose={() => setActiveModal(null)}
			/>
			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					handleReset();
					setActiveModal(null);
				}}
				onCancel={() => setActiveModal(null)}
				confirmText="Yes, Reset"
			/>
			<ConfirmationModal
				visible={activeModal === "exitConfirmation"}
				title="Exit to Menu?"
				message="Are you sure you want to exit? Your current game will be lost."
				onConfirm={() => {
					router.push("/");
				}}
				onCancel={() => setActiveModal(null)}
				confirmText="Yes, Exit"
			/>
		</GameLayout>
	);
};

export default Game;
