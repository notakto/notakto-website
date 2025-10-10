"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Board from "@/app/vsComputer/Board";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
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
import { TOAST_DURATION } from "@/constants/toast";
import BoardConfigModal from "@/modals/BoardConfigModal";
import DifficultyModal from "@/modals/DifficultyModal";
import SoundConfigModal from "@/modals/SoundConfigModal";
import WinnerModal from "@/modals/WinnerModal";
import {
	createGame,
	makeMove,
	resetGame,
	skipMove,
	undoMove,
	updateConfig,
} from "@/services/game-apis";
import { isBoardDead } from "@/services/logic";
import { handleBuyCoins } from "@/services/payment";
import { playMoveSound, playWinSound } from "@/services/sounds";
import { useCoins, useSound, useUser, useXP } from "@/services/store";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
	DifficultyLevel,
} from "@/services/types";

const Game = () => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [, setGameHistory] = useState<BoardState[][]>([]);
	const [currentPlayer, setCurrentPlayer] = useState<number>(1);
	const [winner, setWinner] = useState<string>("");
	const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [showBoardConfig, setShowBoardConfig] = useState<boolean>(false);
	const [showSoundConfig, setShowSoundConfig] = useState<boolean>(false);
	const [isProcessingPayment, setIsProcessingPayment] =
		useState<boolean>(false);
	const [showDifficultyModal, setShowDifficultyModal] =
		useState<boolean>(false);
	const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
	const [sessionId, setSessionId] = useState<string>("");

	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [isInitializing, setIsInitializing] = useState(false);
	const [isResetting, setIsResetting] = useState<boolean>(false);
	const [isUndoing, setIsUndoing] = useState<boolean>(false);
	const [isSkipping, setIsSkipping] = useState<boolean>(false);
	const [isUpdatingConfig, setIsUpdatingConfig] = useState<boolean>(false);
	const [isUpdatingDifficulty, setIsUpdatingDifficulty] =
		useState<boolean>(false);

	const { sfxMute } = useSound();
	const Coins = useCoins((state) => state.coins);
	const setCoins = useCoins((state) => state.setCoins);
	const XP = useXP((state) => state.XP);
	const user = useUser((state) => state.user);
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const { canShowToast, resetCooldown } = useToastCooldown(TOAST_DURATION);
	const router = useRouter();

	const initGame = async (
		num: BoardNumber,
		size: BoardSize,
		diff: DifficultyLevel,
	) => {
		if (isInitializing) return;
		setIsInitializing(true);

		try {
			if (user) {
				const data = await createGame(num, size, diff, await user.getIdToken());
				if (data.success && data.gameState) {
					setSessionId(data.sessionId);
					setBoards(data.gameState.boards);
					setCurrentPlayer(data.gameState.currentPlayer);
					setBoardSize(data.gameState.boardSize);
					setNumberOfBoards(data.gameState.numberOfBoards);
					setDifficulty(data.gameState.difficulty);
					setGameHistory(data.gameState.gameHistory);
				} else if ("error" in data) {
					toast.error(data.error || "Failed to create game");
				} else {
					toast.error("Unexpected response from server");
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error(`Error initializing game: ${error}`);
			router.push("/");
		} finally {
			setIsInitializing(false);
		}
	};

	const handleMove = async (boardIndex: number, cellIndex: number) => {
		if (isProcessing) return;
		setIsProcessing(true);
		try {
			if (user) {
				const data = await makeMove(
					sessionId,
					boardIndex,
					cellIndex,
					await user.getIdToken(),
				);
				if (data.success) {
					setBoards(data.gameState.boards);
					setCurrentPlayer(data.gameState.currentPlayer);
					setGameHistory(data.gameState.gameHistory);
					playMoveSound(sfxMute);

					if (data.gameOver) {
						setWinner(data.gameState.winner);
						setShowWinnerModal(true);
						playWinSound(sfxMute);
					}
				} else if ("error" in data) {
					toast.error(data.error || "Invalid move");
				} else {
					toast.error("Unexpected response from server");
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
			if (user) {
				const data = await resetGame(sessionId, await user.getIdToken());
				if (data.success) {
					setBoards(data.gameState.boards);
					setCurrentPlayer(data.gameState.currentPlayer);
					setGameHistory(data.gameState.gameHistory);
					setWinner("");
					setShowWinnerModal(false);
				} else if ("error" in data) {
					toast.error(data.error || "Failed to reset game");
				} else {
					toast.error("Unexpected response from server");
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
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
						setShowWinnerModal(true);
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
			if (user) {
				const data = await updateConfig(
					sessionId,
					newNumberOfBoards,
					newBoardSize,
					difficulty,
					await user.getIdToken(),
				);
				if (data.success) {
					setNumberOfBoards(newNumberOfBoards);
					setBoardSize(newBoardSize);
					setBoards(data.gameState.boards);
					setCurrentPlayer(data.gameState.currentPlayer);
					setGameHistory(data.gameState.gameHistory);
				} else if ("error" in data) {
					toast.error(data.error || "Failed to update config");
				} else {
					toast.error("Unexpected response from server");
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error("Error updating config");
			console.error("Error updating config:", error);
		} finally {
			setIsUpdatingConfig(false);
		}
	};

	const handleDifficultyChange = async (level: DifficultyLevel) => {
		if (isUpdatingDifficulty) return;
		setIsUpdatingDifficulty(true);

		try {
			if (user) {
				const data = await updateConfig(
					sessionId,
					numberOfBoards,
					boardSize,
					level,
					await user.getIdToken(),
				);
				if (data.success) {
					setDifficulty(level);
					setBoards(data.gameState.boards);
					setCurrentPlayer(data.gameState.currentPlayer);
					setGameHistory(data.gameState.gameHistory);
				} else if ("error" in data) {
					toast.error(data.error || "Failed to update difficulty");
					console.error("Error updating difficulty:", data.error);
				} else {
					toast.error("Unexpected response from server");
					console.error("Unexpected response from server");
				}
			} else {
				toast.error("User not authenticated");
				router.push("/");
			}
		} catch (error) {
			toast.error(`Error updating difficulty: ${error}`);
			console.error("Error updating difficulty:", error);
		} finally {
			setIsUpdatingDifficulty(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <intentionally run only on mount to initialize game once>
	useEffect(() => {
		initGame(numberOfBoards, boardSize, difficulty);
	}, []);

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
								setShowBoardConfig(true);
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
							onClick={() =>
								handleBuyCoins(
									setIsProcessingPayment,
									canShowToast,
									resetCooldown,
									setCoins,
									Coins,
								)
							}
							disabled={isProcessingPayment}
							loading={isProcessingPayment}>
							Buy Coins (100)
						</SettingButton>
						<SettingButton
							onClick={() => {
								setShowDifficultyModal(true);
								setIsMenuOpen(false);
							}}>
							AI Level: {difficulty}
						</SettingButton>
						<SettingButton
							onClick={() => {
								setShowSoundConfig(true);
								setIsMenuOpen(false);
							}}>
							Adjust Sound
						</SettingButton>
						<SettingButton onClick={() => router.push("/")}>
							Main Menu
						</SettingButton>
						<SettingButton onClick={toggleMenu}>Return to Game</SettingButton>
					</SettingContainer>
				</SettingOverlay>
			)}

			<WinnerModal
				visible={showWinnerModal}
				winner={winner}
				onPlayAgain={() => {
					setShowWinnerModal(false);
					handleReset();
				}}
				onMenu={() => {
					setShowWinnerModal(false);
					router.push("/");
				}}
			/>

			<BoardConfigModal
				visible={showBoardConfig}
				currentBoards={numberOfBoards}
				currentSize={boardSize}
				onConfirm={handleBoardConfigChange}
				onCancel={() => setShowBoardConfig(false)}
			/>

			<DifficultyModal
				visible={showDifficultyModal}
				onSelect={(level: DifficultyLevel) => {
					handleDifficultyChange(level);
					setShowDifficultyModal(false);
				}}
				onClose={() => setShowDifficultyModal(false)}
			/>
			<SoundConfigModal
				visible={showSoundConfig}
				onClose={() => setShowSoundConfig(false)}
			/>
		</GameLayout>
	);
};

export default Game;
