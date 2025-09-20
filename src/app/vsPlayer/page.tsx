'use client'

import { useState } from 'react';
import Board from './Board';
import { BoardSize, BoardState, PlayerButtonModalType } from '@/services/types';
import { isBoardDead } from '@/services/logic';
import { playMoveSound, playWinSound } from '@/services/sounds';
import { useSound } from '@/services/store';
import { useRouter } from 'next/navigation';
import PlayerNamesModal from '@/modals/PlayerNamesModal';
import WinnerModal from '@/modals/WinnerModal';
import SoundConfigModal from '@/modals/SoundConfigModal';
import BoardConfigModal from '@/modals/BoardConfigModal';
import { SettingButton } from '@/components/ui/Buttons/SettingButton';
import { useShortcut } from '@/components/hooks/useShortcut';
import ShortcutModal from '@/modals/ShortcutModal';

const Game = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [boardSize, setBoardSize] = useState<BoardSize>(3);
    const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
    const [player1Name, setPlayer1Name] = useState<string>('Player 1');
    const [player2Name, setPlayer2Name] = useState<string>('Player 2');
    const [winner, setWinner] = useState<string>('');
    const [numberOfBoards, setNumberOfBoards] = useState<number>(3);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [initialSetupDone, setInitialSetupDone] = useState<boolean>(false);
    const [activeModal, setActiveModal] = useState<PlayerButtonModalType>('names');

    const { sfxMute } = useSound();
    const router = useRouter();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    useShortcut((e) => {
        const el = e.target as HTMLElement | null;
        const tag = el?.tagName?.toLowerCase();

        if (e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
        if (tag === 'input' || el?.isContentEditable) return;

        const k = e.key.toLowerCase();

        if (e.key === 'Escape') {
            // prevent escape before setup
            if (!initialSetupDone && !gameStarted) return;
            if (activeModal) return setActiveModal(null);
            return setIsMenuOpen(false);
        }

        if (k === 'r') resetGame(numberOfBoards, boardSize);
        if (k === 'm') router.push('/');

        if (!initialSetupDone) {
            // only allow sound + shortcut modals
            if (k === "s") setActiveModal(prev => prev === 'soundConfig' ? null : 'soundConfig');
            if (k === "q") setActiveModal(prev => prev === 'shortcut' ? null : 'shortcut');
            return;
        }

        // once setup is done --> allow all
        if (k === "n") setActiveModal(prev => prev === 'names' ? null : 'names');
        if (k === "c") setActiveModal(prev => prev === 'boardConfig' ? null : 'boardConfig');
        if (k === "s") setActiveModal(prev => prev === 'soundConfig' ? null : 'soundConfig');
        if (k === "q") setActiveModal(prev => prev === 'shortcut' ? null : 'shortcut');
    });


    const makeMove = (boardIndex: number, cellIndex: number) => {
        if (boards[boardIndex][cellIndex] !== '' || isBoardDead(boards[boardIndex], boardSize)) return;

        const newBoards = boards.map((board, idx) =>
            idx === boardIndex
                ? [...board.slice(0, cellIndex), 'X', ...board.slice(cellIndex + 1)]
                : [...board]
        );
        playMoveSound(sfxMute);
        setBoards(newBoards);

        if (newBoards.every(board => isBoardDead(board, boardSize))) {
            const loser = currentPlayer;
            const winnerNum = loser === 1 ? 2 : 1;
            const winnerName = winnerNum === 1 ? player1Name : player2Name;
            setWinner(winnerName);
            setActiveModal('winner');
            playWinSound(sfxMute);
            return;
        }

        setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
    };

    const resetGame = (num: number, size: BoardSize) => {
        const initialBoards = Array(num).fill(null).map(() => Array(size * size).fill(''));
        setBoards(initialBoards);
        setCurrentPlayer(1);
        setActiveModal(null);
    };

    const handleBoardConfigChange = (num: number, size: number) => {
        setNumberOfBoards(Math.min(5, Math.max(1, num)));
        setBoardSize(size as BoardSize);
        setActiveModal(null);
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
                        <SettingButton
                            onClick={() => {
                                resetGame(numberOfBoards, boardSize);
                                setIsMenuOpen(false);
                            }}>
                            Reset
                        </SettingButton>

                        <SettingButton
                            onClick={() => {
                                setActiveModal('boardConfig');
                                setIsMenuOpen(false);
                            }}>
                            Game Configuration
                        </SettingButton>

                        <SettingButton onClick={() => {
                            setActiveModal('names');
                            setIsMenuOpen(false);
                        }}>
                            Reset Names
                        </SettingButton>

                        <SettingButton
                            onClick={() => {
                                setActiveModal('soundConfig');
                                setIsMenuOpen(false)
                            }}>
                            Adjust Sound
                        </SettingButton>

                        <SettingButton
                            onClick={() => {
                                setActiveModal('shortcut');
                                setIsMenuOpen(false);
                            }}>
                            Keyboard Shortcuts
                        </SettingButton>

                        <SettingButton onClick={exitToMenu}>Main Menu</SettingButton>
                        <SettingButton onClick={toggleMenu}>Return to Game</SettingButton>
                    </div>
                </div>
            )}

            <PlayerNamesModal
                visible={activeModal === 'names' || (!initialSetupDone && !gameStarted)}
                onSubmit={(name1: string, name2: string) => {
                    setPlayer1Name(name1 || 'Player 1');
                    setPlayer2Name(name2 || 'Player 2');
                    setGameStarted(true);
                    setInitialSetupDone(true);
                    setActiveModal(null);
                    resetGame(numberOfBoards, boardSize);
                }}
                initialNames={[player1Name, player2Name]}
                key={player1Name + player2Name}
            />

            <WinnerModal
                visible={activeModal === 'winner'}
                winner={winner}
                onPlayAgain={() => {
                    setActiveModal(null);
                    resetGame(numberOfBoards, boardSize);
                }}
                onMenu={() => { setActiveModal(null); exitToMenu(); } }
            />

            <BoardConfigModal
                visible={activeModal === 'boardConfig'}
                currentBoards={numberOfBoards}
                currentSize={boardSize}
                onConfirm={handleBoardConfigChange}
                onCancel={() => setActiveModal(null)}
            />

            <SoundConfigModal
                visible={activeModal === 'soundConfig'}
                onClose={() => setActiveModal(null)}
            />

            <ShortcutModal
                visible={activeModal === 'shortcut'}
                onClose={() => setActiveModal(null)}
            />
        </div>
    );
};

export default Game;
