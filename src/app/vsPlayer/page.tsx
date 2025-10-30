"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Board from "@/app/vsPlayer/Board";
import { useShortcut } from "@/components/hooks/useShortcut";
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
import { applyMove } from "@/lib/game/state";
import BoardConfigModal from "@/modals/BoardConfigModal";
import ConfirmationModal from "@/modals/ConfirmationModal";
import PlayerNamesModal from "@/modals/PlayerNamesModal";
import ShortcutModal from "@/modals/ShortcutModal";
import SoundConfigModal from "@/modals/SoundConfigModal";
import WinnerModal from "@/modals/WinnerModal";
import { isBoardDead } from "@/services/logic";
import { playMoveSound, playWinSound } from "@/services/sounds";
import { useSound } from "@/services/store";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
	PlayerButtonModalType,
} from "@/services/types";

const getInitialBoards = (
	numBoards: BoardNumber,
	boardSize: BoardSize,
): BoardState[] => {
	return Array.from({ length: numBoards }, () =>
		Array(boardSize * boardSize).fill(""),
	);
};

const checkWinner = (
	boards: BoardState[],
	boardSize: BoardSize,
	player: 1 | 2,
	playerNames: [string, string],
): string => {
	const allDead = boards.every((board) => isBoardDead(board, boardSize));
	if (allDead) {
		return playerNames[player === 1 ? 1 : 0];
	}
	return "";
};

const undoMove = (
	gameHistory: BoardState[][],
	currentPlayer: 1 | 2,
): {
	lastBoards: BoardState[];
	newHistory: BoardState[][];
	newPlayer: 1 | 2;
	undoSuccessful: boolean;
} => {
	if (gameHistory.length <= 1)
		return {
			lastBoards: gameHistory[0],
			newHistory: gameHistory,
			newPlayer: currentPlayer,
			undoSuccessful: false,
		};
	const newHistory = [...gameHistory];
	newHistory.pop();
	const lastBoards = newHistory[newHistory.length - 1];
	const newPlayer = currentPlayer === 1 ? 2 : 1;
	return { lastBoards, newHistory, newPlayer, undoSuccessful: true };
};

const Game = () => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [gameHistory, setGameHistory] = useState<BoardState[][]>([]);
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [playerNames, setPlayerNames] = useState<[string, string]>([
		"Player 1",
		"Player 2",
	]);
	const [winner, setWinner] = useState<string>("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [activeModal, setActiveModal] =
		useState<PlayerButtonModalType>("names");
	const [initialSetupDone, setInitialSetupDone] = useState(false);

	const { sfxMute } = useSound();
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const router = useRouter();

	const resetGame = (num: BoardNumber, size: BoardSize) => {
		const newBoards = getInitialBoards(num, size);
		setBoards(newBoards);
		setGameHistory([newBoards]);
		setCurrentPlayer(1);
		setWinner("");
		setActiveModal(null);
	};

	useShortcut(
		{
			escape: () => {
				if (activeModal) return setActiveModal(null);
				return setIsMenuOpen(false);
			},
			m: () => {
				if (!initialSetupDone) return;
				setActiveModal("exitConfirmation");
			},
			r: () => {
				if (!initialSetupDone) return;
				setActiveModal("resetConfirmation");
			},
			c: () => {
				if (!initialSetupDone) return;
				setActiveModal((prev: PlayerButtonModalType) =>
					prev === "boardConfig" ? null : "boardConfig",
				);
			},
			n: () => {
				if (!initialSetupDone) return;
				setActiveModal((prev: PlayerButtonModalType) =>
					prev === "names" ? null : "names",
				);
			},
			s: () => {
				if (!initialSetupDone) return;
				setActiveModal((prev: PlayerButtonModalType) =>
					prev === "soundConfig" ? null : "soundConfig",
				);
			},
			q: () => {
				if (!initialSetupDone) return;
				setActiveModal((prev: PlayerButtonModalType) =>
					prev === "shortcut" ? null : "shortcut",
				);
			},
		},
		isMenuOpen || !initialSetupDone || activeModal !== null,
	);

	useEffect(() => {
		const newBoards = getInitialBoards(numberOfBoards, boardSize);
		setBoards(newBoards);
		setGameHistory([newBoards]);
	}, [numberOfBoards, boardSize]);

	const handleMove = (boardIndex: number, cellIndex: number) => {
		const tempGameState = {
			boards,
			gameHistory,
			currentPlayer,
			boardSize,
			numberOfBoards,
			winner,
			difficulty: 1 as 1,
			sessionId: "",
		};

		if (
			boards[boardIndex][cellIndex] !== "" ||
			isBoardDead(boards[boardIndex], boardSize)
		) {
			return;
		}

		applyMove(tempGameState, { boardIndex, cellIndex });
		const newBoards = tempGameState.boards;
		const newHistory = tempGameState.gameHistory;
		const newPlayer = tempGameState.currentPlayer === 1 ? 2 : 1;

		playMoveSound(sfxMute);
		setBoards(newBoards);
		setGameHistory(newHistory);

		const gameWinner = checkWinner(
			newBoards,
			boardSize,
			newPlayer,
			playerNames,
		);
		if (gameWinner) {
			setWinner(gameWinner);
			setActiveModal("winner");
			playWinSound(sfxMute);
		} else {
			setCurrentPlayer(newPlayer);
		}
	};

	const handleBoardConfigChange = (
		newNumberOfBoards: BoardNumber,
		newBoardSize: BoardSize,
	) => {
		setNumberOfBoards(newNumberOfBoards);
		setBoardSize(newBoardSize);
		resetGame(newNumberOfBoards, newBoardSize);
		setActiveModal(null);
	};

	const handleUndo = () => {
		const { lastBoards, newHistory, newPlayer, undoSuccessful } = undoMove(
			gameHistory,
			currentPlayer,
		);
		if (undoSuccessful) {
			setBoards(lastBoards);
			setGameHistory(newHistory);
			setCurrentPlayer(newPlayer);
		}
	};

	const handlePlayerNamesSubmit = (p1: string, p2: string) => {
		setPlayerNames([p1, p2]);
		setActiveModal(null);
		setInitialSetupDone(true);
	};

	return (
		<GameLayout>
			<GameBoardArea>
				<PlayerStatusContainer>
					<StatContainer>
						<StatLabel text={playerNames[0]} />
						<StatLabel text={"|"} />
						<StatLabel text={playerNames[1]} />
					</StatContainer>
					<PlayerTurnTitle text={`${playerNames[currentPlayer - 1]}'s Turn`} />
				</PlayerStatusContainer>

				<BoardContainer>
					{boards.map((board: BoardState, index: number) => (
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
								resetGame(numberOfBoards, boardSize);
								setIsMenuOpen(false);
							}}>
							Reset
						</SettingButton>
						<SettingButton
							onClick={() => {
								setActiveModal("boardConfig");
								setIsMenuOpen(false);
							}}>
							Game Configuration
						</SettingButton>
						<SettingButton
							onClick={() => {
								handleUndo();
								setIsMenuOpen(false);
							}}
							disabled={gameHistory.length <= 1}>
							Undo Move
						</SettingButton>
						<SettingButton
							onClick={() => {
								setActiveModal("names");
								setIsMenuOpen(false);
							}}>
							Change Names
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

			<PlayerNamesModal
				visible={activeModal === "names"}
				onSubmit={handlePlayerNamesSubmit}
				initialNames={playerNames}
			/>

			<WinnerModal
				visible={activeModal === "winner"}
				winner={winner}
				onPlayAgain={() => {
					resetGame(numberOfBoards, boardSize);
					setActiveModal(null);
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
			<SoundConfigModal
				visible={activeModal === "soundConfig"}
				onClose={() => setActiveModal(null)}
			/>
			<ShortcutModal
				visible={activeModal === "shortcut"}
				onClose={() => setActiveModal(null)}
			/>

			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					resetGame(numberOfBoards, boardSize);
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
