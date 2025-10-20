"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Board from "@/app/vsPlayer/Board";
import { useShortcut } from "@/components/hooks/useShortcut";
import SettingBar from "@/components/ui/Buttons/SettingBar";
import { SettingButton } from "@/components/ui/Buttons/SettingButton";
import BoardContainer from "@/components/ui/Containers/Board/BoardContainer";
import BoardWrapper from "@/components/ui/Containers/Board/BoardWrapper";
import GameBoardArea from "@/components/ui/Containers/Games/GameBoardArea";
import PlayerStatusContainer from "@/components/ui/Containers/Games/PlayerStatusContainer";
import SettingContainer from "@/components/ui/Containers/Settings/SettingContainer";
import SettingOverlay from "@/components/ui/Containers/Settings/SettingOverlay";
import GameLayout from "@/components/ui/Layout/GameLayout";
import PlayerTurnTitle from "@/components/ui/Title/PlayerTurnTitle";
import BoardConfigModal from "@/modals/BoardConfigModal";
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

const Game = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [player1Name, setPlayer1Name] = useState<string>("Player 1");
	const [player2Name, setPlayer2Name] = useState<string>("Player 2");
	const [winner, setWinner] = useState<string>("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [initialSetupDone, setInitialSetupDone] = useState<boolean>(false);
	const [activeModal, setActiveModal] =
		useState<PlayerButtonModalType>("names");

	const { sfxMute } = useSound();
	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const router = useRouter();

	useShortcut(
		{
			escape: () => {
				if (!initialSetupDone && !gameStarted) return;
				if (activeModal) return setActiveModal(null);
				return setIsMenuOpen(false);
			},
			m: () => {
				if (!initialSetupDone) return;
				router.push("/");
			},
			r: () => {
				if (!initialSetupDone) return;
				resetGame(numberOfBoards, boardSize);
			},
			n: () => {
				if (!initialSetupDone) return;
				setActiveModal((prev) => (prev === "names" ? null : "names"));
			},
			c: () => {
				if (!initialSetupDone) return;
				setActiveModal((prev) =>
					prev === "boardConfig" ? null : "boardConfig",
				);
			},
			s: () => {
				if (!initialSetupDone) return;
				setActiveModal((prev) =>
					prev === "soundConfig" ? null : "soundConfig",
				);
			},
			q: () => {
				if (!initialSetupDone) return;
				setActiveModal((prev) => (prev === "shortcut" ? null : "shortcut"));
			},
		},
		isMenuOpen, // disabled option
	);

	const makeMove = (boardIndex: number, cellIndex: number) => {
		if (
			boards[boardIndex][cellIndex] !== "" ||
			isBoardDead(boards[boardIndex], boardSize)
		)
			return;

		const newBoards = boards.map((board, idx) =>
			idx === boardIndex
				? [...board.slice(0, cellIndex), "X", ...board.slice(cellIndex + 1)]
				: [...board],
		);
		playMoveSound(sfxMute);
		setBoards(newBoards);

		if (newBoards.every((board) => isBoardDead(board, boardSize))) {
			const loser = currentPlayer;
			const winnerNum = loser === 1 ? 2 : 1;
			const winnerName = winnerNum === 1 ? player1Name : player2Name;
			setWinner(winnerName);
			setActiveModal("winner");
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
		setActiveModal(null);
	};

	const handleBoardConfigChange = (num: BoardNumber, size: BoardSize) => {
		setNumberOfBoards(num);
		setBoardSize(size as BoardSize);
		setActiveModal(null);
		resetGame(num, size);
	};

	const exitToMenu = () => {
		router.push("/");
	};

	return (
		<GameLayout>
			<GameBoardArea>
				<PlayerStatusContainer>
					<PlayerTurnTitle
						text={
							currentPlayer === 1
								? `${player1Name}'s turn`
								: `${player2Name}'s turn`
						}
					/>
				</PlayerStatusContainer>

				<BoardContainer>
					{boards.map((board, index) => {
						const boardKey = `${board.join("-")}-${index}`; //TODO: use better key
						return (
							<BoardWrapper key={boardKey}>
								<Board
									boardIndex={index}
									boardState={board}
									makeMove={makeMove}
									isDead={isBoardDead(board, boardSize)}
									boardSize={boardSize}
								/>
							</BoardWrapper>
						);
					})}
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
								setActiveModal("names");
								setIsMenuOpen(false);
							}}>
							Reset Names
						</SettingButton>
						<SettingButton
							onClick={() => {
								setActiveModal("soundConfig");
								setIsMenuOpen(false);
							}}>
							Adjust Sound
						</SettingButton>
						<SettingButton
							onClick={() => {
								setActiveModal("shortcut");
								setIsMenuOpen(false);
							}}>
							Keyboard Shortcuts
						</SettingButton>
						<SettingButton onClick={exitToMenu}>Main Menu</SettingButton>
						<SettingButton onClick={toggleMenu}>Return to Game</SettingButton>
					</SettingContainer>
				</SettingOverlay>
			)}

			<PlayerNamesModal
				visible={activeModal === "names"}
				onSubmit={(name1: string, name2: string) => {
					setPlayer1Name(name1 || "Player 1");
					setPlayer2Name(name2 || "Player 2");
					setActiveModal(null);
					resetGame(numberOfBoards, boardSize);
					setInitialSetupDone(true);
					setGameStarted(true);
				}}
				initialNames={[player1Name, player2Name]}
				key={player1Name + player2Name}
			/>
			<WinnerModal
				visible={activeModal === "winner"}
				winner={winner}
				onPlayAgain={() => {
					setActiveModal(null);
					resetGame(numberOfBoards, boardSize);
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
		</GameLayout>
	);
};

export default Game;
