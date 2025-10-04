'use client'

import { useState } from 'react';
import Board from './Board';
import { BoardSize, BoardState } from '@/services/types';
import { isBoardDead } from '@/services/logic';
import { playMoveSound, playWinSound } from '@/services/sounds';
import { useSound } from '@/services/store';
import { useRouter } from 'next/navigation';
import PlayerNamesModal from '@/modals/PlayerNamesModal';
import WinnerModal from '@/modals/WinnerModal';
import SoundConfigModal from '@/modals/SoundConfigModal';
import BoardConfigModal from '@/modals/BoardConfigModal';
import { SettingButton } from '@/components/ui/Buttons/SettingButton';
import GameLayout from '@/components/ui/Layout/GameLayout';
import BoardWrapper from '@/components/ui/Containers/Board/BoardWrapper';
import SettingOverlay from '@/components/ui/Containers/Settings/SettingOverlay';
import SettingContainer from '@/components/ui/Containers/Settings/SettingContainer';
import PlayerTurnTitle from '@/components/ui/Title/PlayerTurnTitle';
import SettingBar from '@/components/ui/Buttons/SettingBar';
import BoardContainer from '@/components/ui/Containers/Board/BoardContainer';
import GameBoardArea from '@/components/ui/Containers/Games/GameBoardArea';
import PlayerStatusContainer from '@/components/ui/Containers/Games/PlayerStatusContainer';
const Game = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [boardSize, setBoardSize] = useState<BoardSize>(3);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [player1Name, setPlayer1Name] = useState<string>('Player 1');
    const [player2Name, setPlayer2Name] = useState<string>('Player 2');
    const [showNameModal, setShowNameModal] = useState<boolean>(true);
    const [winner, setWinner] = useState<string>('');
    const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
    const [numberOfBoards, setNumberOfBoards] = useState<number>(3);
    const [showBoardConfig, setShowBoardConfig] = useState<boolean>(false);
    const [showSoundConfig, setShowSoundConfig] = useState<boolean>(false);

    const { sfxMute } = useSound();
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const router = useRouter();

    const makeMove = (boardIndex: number, cellIndex: number) => {
        if (boards[boardIndex][cellIndex] !== '' || isBoardDead(boards[boardIndex], boardSize)) return;

        const newBoards = boards.map((board, idx) =>
            idx === boardIndex ? [
                ...board.slice(0, cellIndex),
                'X',
                ...board.slice(cellIndex + 1)
            ] : [...board]
        );
        playMoveSound(sfxMute);
        setBoards(newBoards);

        if (newBoards.every(board => isBoardDead(board, boardSize))) {
            const loser = currentPlayer;
            const winnerNum = loser === 1 ? 2 : 1;
            const winnerName = winnerNum === 1 ? player1Name : player2Name;
            setWinner(winnerName);
            setShowWinnerModal(true);
            playWinSound(sfxMute);
            return;
        }

        setCurrentPlayer(prev => prev === 1 ? 2 : 1);
    };

    const resetGame = (num: number, size: BoardSize) => {
        const initialBoards = Array(num).fill(null).map(() => Array(size * size).fill(''));
        setBoards(initialBoards);
        setCurrentPlayer(1);
        setShowWinnerModal(false);
    };

    const handleBoardConfigChange = (num: number, size: number) => {
        setNumberOfBoards(Math.min(5, Math.max(1, num)));
        setBoardSize(size as BoardSize);
        setShowBoardConfig(false);
        resetGame(num, size as BoardSize);
    };

    const exitToMenu = () => {
        router.push('/');
    };

    return (
        <GameLayout>
            <GameBoardArea>
                <PlayerStatusContainer>
                    <PlayerTurnTitle text={currentPlayer === 1 ? `${player1Name}'s turn` : `${player2Name}'s turn`} />
                </PlayerStatusContainer>

                <BoardContainer>
                    {boards.map((board, index) => (
                        <BoardWrapper key={index}>
                            <Board
                                boardIndex={index}
                                boardState={board}
                                makeMove={makeMove}
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
                        <SettingButton onClick={() => { resetGame(numberOfBoards, boardSize); setIsMenuOpen(false); }}>Reset</SettingButton>
                        <SettingButton onClick={() => { setShowBoardConfig(!showBoardConfig); setIsMenuOpen(false); }}>Game Configuration</SettingButton>
                        <SettingButton onClick={() => { setShowNameModal(true); setIsMenuOpen(false); }}>Reset Names</SettingButton>
                        <SettingButton onClick={() => { setShowSoundConfig(true); setIsMenuOpen(false) }}>Adjust Sound</SettingButton>
                        <SettingButton onClick={exitToMenu}>Main Menu</SettingButton>
                        <SettingButton onClick={toggleMenu}>Return to Game</SettingButton>
                    </SettingContainer>
                </SettingOverlay>
            )}

            <PlayerNamesModal
                visible={showNameModal}
                onSubmit={(name1: string, name2: string) => {
                    setPlayer1Name(name1 || 'Player 1');
                    setPlayer2Name(name2 || 'Player 2');
                    setShowNameModal(false);
                    resetGame(numberOfBoards, boardSize);
                }}
                initialNames={[player1Name, player2Name]}
                key={player1Name + player2Name}
            />
            <WinnerModal
                visible={showWinnerModal}
                winner={winner}
                onPlayAgain={() => {
                    setShowWinnerModal(false);
                    resetGame(numberOfBoards, boardSize);
                }}
                onMenu={() => {
                    setShowWinnerModal(false);
                }}
            />
            <BoardConfigModal
                visible={showBoardConfig}
                currentBoards={numberOfBoards}
                currentSize={boardSize}
                onConfirm={handleBoardConfigChange}
                onCancel={() => setShowBoardConfig(false)}
            />
            <SoundConfigModal
                visible={showSoundConfig}
                onClose={() => setShowSoundConfig(false)}
            />
        </GameLayout>
    );
};

export default Game;