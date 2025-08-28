'use client'

import { useEffect, useState } from 'react';
import Board from './Board';
import { BoardSize, BoardState, DifficultyLevel, BoardNumber } from '@/services/types';
import { isBoardDead } from '@/services/logic';
import { playMoveSound, playWinSound } from '@/services/sounds';
import { useMute, useUser } from '@/services/store';
import { useRouter } from 'next/navigation';
import WinnerModal from '@/modals/WinnerModal';
import BoardConfigModal from '@/modals/BoardConfigModal';
import { useCoins, useXP } from '@/services/store';
import DifficultyModal from '@/modals/DifficultyModal';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { handleBuyCoins } from '@/services/payment';
import { SettingButton } from '@/components/ui/Buttons/SettingButton';
import { createGame, makeMove, resetGame, updateConfig, undoMove, skipMove } from '@/services/game-apis';

const Game = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [boardSize, setBoardSize] = useState<BoardSize>(3);
    const [gameHistory, setGameHistory] = useState<BoardState[][]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<number>(1);
    const [winner, setWinner] = useState<string>('');
    const [showWinnerModal, setShowWinnerModal] = useState<boolean>(false);
    const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
    const [showBoardConfig, setShowBoardConfig] = useState<boolean>(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
    const [showDifficultyModal, setShowDifficultyModal] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
    const [sessionId, setSessionId] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const mute = useMute((state) => state.mute);
    const setMute = useMute((state) => state.setMute);
    const Coins = useCoins((state) => state.coins);
    const setCoins = useCoins((state) => state.setCoins);
    const XP = useXP((state) => state.XP);
    const setXP = useXP((state) => state.setXP);
    const user = useUser((state) => state.user);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const { canShowToast, triggerToastCooldown } = useToastCooldown(4000);
    const router = useRouter();

    const initGame = async (num: BoardNumber, size: BoardSize, diff: DifficultyLevel) => {
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
                } else if ('error' in data) {
                    toast.error(data.error || 'Failed to create game');
                } else {
                    toast.error('Unexpected response from server');
                }
            }
            else {
                toast.error('User not authenticated');
                router.push('/');
            }
        } catch (error) {
            toast.error('Error initializing game');
            router.push('/');
        }
    };

    const handleMove = async (boardIndex: number, cellIndex: number) => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            if (user) {
                const data = await makeMove(sessionId, boardIndex, cellIndex, await user.getIdToken());
                if (data.success) {
                    setBoards(data.gameState.boards);
                    setCurrentPlayer(data.gameState.currentPlayer);
                    setGameHistory(data.gameState.gameHistory);
                    playMoveSound(mute);

                    if (data.gameOver) {
                        if (data.gameState.coins) setCoins(Coins + data.gameState.coins);
                        if (data.gameState.xp) setXP(XP + data.gameState.xp);
                        setWinner(data.gameState.winner);
                        setShowWinnerModal(true);
                        playWinSound(mute);
                    }
                } else if ('error' in data) {
                    toast.error(data.error || 'Invalid move');
                } else {
                    toast.error('Unexpected response from server');
                }
            } else {
                toast.error('User not authenticated');
                router.push('/');
            }
        } catch (error) {
            toast.error('Error making move');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = async () => {
        try {
            if (user) {
                const data = await resetGame(sessionId, await user.getIdToken());
                if (data.success) {
                    setBoards(data.gameState.boards);
                    setCurrentPlayer(data.gameState.currentPlayer);
                    setGameHistory(data.gameState.gameHistory);
                    setWinner('');
                    setShowWinnerModal(false);
                } else if ('error' in data) {
                    toast.error(data.error || 'Failed to reset game');
                } else {
                    toast.error('Unexpected response from server');
                }
            }
            else {
                toast.error('User not authenticated');
                router.push('/');
            }
        } catch (error) {
            toast.error('Error resetting game');
        }
    };

    const handleUndo = async () => {
        if (Coins < 100) {
            toast.error('Not enough coins');
            return;
        }
        try {
            if (user) {
                const data = await undoMove(sessionId, await user.getIdToken());
                if (data.success) {
                    setBoards(data.gameState.boards);
                    setCurrentPlayer(data.gameState.currentPlayer);
                    setGameHistory(data.gameState.gameHistory);
                    setCoins(Coins - 100);
                } else if ('error' in data) {
                    toast.error(data.error || 'Failed to undo move');
                } else {
                    toast.error('Unexpected response from server');
                }
            }
            else {
                toast.error('User not authenticated');
                router.push('/');
            }
        } catch (error) {
            toast.error('Error undoing move');
        }
    };

    const handleSkip = async () => {
        if (Coins < 200) {
            toast.error('Not enough coins');
            return;
        }
        try {
            if (user) {
                const data = await skipMove(sessionId, await user.getIdToken());
                if (data.success) {
                    setBoards(data.gameState.boards);
                    setCurrentPlayer(data.gameState.currentPlayer);
                    setGameHistory(data.gameState.gameHistory);
                    setCoins(Coins - 200);
                } else if ('error' in data) {
                    toast.error(data.error || 'Failed to skip move');
                } else {
                    toast.error('Unexpected response from server');
                }
            }
            else {
                toast.error('User not authenticated');
                router.push('/');
            }
        } catch (error) {
            toast.error('Error skipping move');
        }
    };

    const handleBoardConfigChange = async (newNumberOfBoards: BoardNumber, newBoardSize: BoardSize) => {
        try {
            if (user) {
                const data = await updateConfig(sessionId, newNumberOfBoards, newBoardSize, difficulty, await user.getIdToken());
                if (data.success) {
                    setNumberOfBoards(newNumberOfBoards);
                    setBoardSize(newBoardSize);
                    setBoards(data.gameState.boards);
                    setCurrentPlayer(data.gameState.currentPlayer);
                    setGameHistory(data.gameState.gameHistory);
                } else if ('error' in data) {
                    toast.error(data.error || 'Failed to update config');
                } else {
                    toast.error('Unexpected response from server');
                }
            }
            else {
                toast.error('User not authenticated');
                router.push('/');
            }
        } catch (error) {
            toast.error('Error updating config');
        }
    };

    const handleDifficultyChange = async (level: DifficultyLevel) => {
        try {
            if (user) {
                const data = await updateConfig(sessionId, numberOfBoards, boardSize, level, await user.getIdToken());
                if (data.success) {
                    setDifficulty(level);
                    setBoards(data.gameState.boards);
                    setCurrentPlayer(data.gameState.currentPlayer);
                    setGameHistory(data.gameState.gameHistory);
                } else if ('error' in data) {
                    toast.error(data.error || 'Failed to update difficulty');
                } else {
                    toast.error('Unexpected response from server');
                }
            }
            else {
                toast.error('User not authenticated');
                router.push('/');
            }
        } catch (error) {
            toast.error('Error updating difficulty');
        }
    };

    useEffect(() => {
        initGame(numberOfBoards, boardSize, difficulty);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-black relative">
            <div className="flex-1">
                <div className="flex flex-col items-center px-6 py-4 -mb-8">
                    <div className="flex flex-row justify-center items-center -mt-2">
                        <span className="text-red-600 text-[35px] ">Coins: {Coins}</span>
                        <span className="text-red-600 text-[35px] "> | XP: {XP}</span>
                    </div>
                    <h2 className="text-red-600 text-[80px] mb-5 text-center">
  {currentPlayer === 1 ? "Your Turn" : "Computer's Turn"}
</h2>

                </div>

                <div className="flex flex-wrap justify-center gap-4 p-4 w-full mb-20">
                    {boards.map((board, index) => (
                        <div key={index} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.3%-1.5rem)]" style={{ maxWidth: '400px' }}>
                            <Board
                                boardIndex={index}
                                boardState={board}
                                makeMove={handleMove}
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
                        <SettingButton onClick={() => { handleReset(); setIsMenuOpen(false); }}>Reset</SettingButton>
                        <SettingButton onClick={() => { setShowBoardConfig(true); setIsMenuOpen(false); }}>Game Configuration</SettingButton>
                        <SettingButton onClick={() => { handleUndo(); setIsMenuOpen(false); }} disabled={Coins < 100}>Undo (100 coins)</SettingButton>
                        <SettingButton onClick={() => { handleSkip(); setIsMenuOpen(false); }} disabled={Coins < 200}>Skip a Move (200 coins)</SettingButton>
                        <SettingButton onClick={() => handleBuyCoins(setIsProcessingPayment, canShowToast, triggerToastCooldown, setCoins, Coins)} disabled={isProcessingPayment} loading={isProcessingPayment}>Buy Coins (100)</SettingButton>
                        <SettingButton onClick={() => { setShowDifficultyModal(true); setIsMenuOpen(false); }}>AI Level: {difficulty}</SettingButton>
                        <SettingButton onClick={() => setMute(!mute)}>Sound: {mute ? 'Off' : 'On'}</SettingButton>
                        <SettingButton onClick={() => router.push('/')}>Main Menu</SettingButton>
                        <SettingButton onClick={toggleMenu}>Return to Game</SettingButton>
                    </div>
                </div>
            )}

            <WinnerModal
                visible={showWinnerModal}
                winner={winner}
                onPlayAgain={() => { setShowWinnerModal(false); handleReset(); }}
                onMenu={() => { setShowWinnerModal(false); router.push('/'); }}
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
        </div>
    );
};

export default Game;