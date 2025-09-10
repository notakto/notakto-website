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
        <div className="flex flex-col min-h-screen bg-black relative">
            <div className="flex-1">
                <div className="flex flex-col items-center px-6 py-4 -mb-8">
                    <h2 className="text-red-600 text-[80px] mb-5 text-center">
                        {currentPlayer === 1 ? `${player1Name}'s turn` : `${player2Name}'s turn`}
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-4 p-4 w-full mb-20">
                    {boards.map((board, index) => (
                        <div key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.3%-1.5rem)]" style={{ maxWidth: '400px' }}>
                            <Board
                                boardIndex={index}
                                boardState={board}
                                makeMove={makeMove}
                                isDead={isBoardDead(board, boardSize)}
                                boardSize={boardSize}
                            />
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center bg-blue-600 px-6 py-2 mt-2">
                    <button onClick={toggleMenu} className="text-white text-[35px]">Settings</button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-[9999] flex items-center justify-center px-4 overflow-y-auto">
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl py-8">
                        <SettingButton onClick={() => { resetGame(numberOfBoards, boardSize); setIsMenuOpen(false); }}>Reset</SettingButton>
                        <SettingButton onClick={() => { setShowBoardConfig(!showBoardConfig); setIsMenuOpen(false); }}>Game Configuration</SettingButton>
                        <SettingButton onClick={() => { setShowNameModal(true); setIsMenuOpen(false); }}>Reset Names</SettingButton>
                        <SettingButton onClick={() => { setShowSoundConfig(true); setIsMenuOpen(false) }}>Adjust Sound</SettingButton>
                        <SettingButton onClick={exitToMenu}>Main Menu</SettingButton>
                        <SettingButton onClick={toggleMenu}>Return to Game</SettingButton>
                    </div>
                </div>
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
        </div>
    );
};

export default Game;