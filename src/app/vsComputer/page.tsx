'use client'

import { useEffect, useState } from 'react';
import Board from './Board';
import { BoardSize, BoardState, DifficultyLevel, BoardNumber, ComputerButtonModalType } from '@/services/types';
import { isBoardDead } from '@/services/logic';
import { playMoveSound, playWinSound } from '@/services/sounds';
import { useUser } from '@/services/store';
import { useRouter } from 'next/navigation';
import WinnerModal from '@/modals/WinnerModal';
import BoardConfigModal from '@/modals/BoardConfigModal';
import { useCoins, useXP } from '@/services/store';
import DifficultyModal from '@/modals/DifficultyModal';
import { toast } from "react-toastify";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { handleBuyCoins } from '@/services/payment';
import { SettingButton } from '@/components/ui/Buttons/SettingButton';
import SoundConfigModal from '@/modals/SoundConfigModal';
import { createGame, makeMove, resetGame, updateConfig, undoMove, skipMove } from '@/services/game-apis';
import { TOAST_DURATION } from '@/constants/toast';
import { useSound } from '@/services/store';
import GameLayout from '@/components/ui/Layout/GameLayout';
import BoardWrapper from '@/components/ui/Containers/Board/BoardWrapper';
import SettingOverlay from '@/components/ui/Containers/Settings/SettingOverlay';
import SettingContainer from '@/components/ui/Containers/Settings/SettingContainer';
import PlayerTurnTitle from '@/components/ui/Title/PlayerTurnTitle';
import SettingBar from '@/components/ui/Buttons/SettingBar';
import BoardContainer from '@/components/ui/Containers/Board/BoardContainer';
import GameBoardArea from '@/components/ui/Containers/Games/GameBoardArea';
import PlayerStatusContainer from '@/components/ui/Containers/Games/PlayerStatusContainer';
import StatLabel from '@/components/ui/Title/StatLabel';
import StatContainer from '@/components/ui/Containers/Games/StatContainer';
import { useShortcut } from '@/components/hooks/useShortcut';
import ShortcutModal from '@/modals/ShortcutModal';

const Game = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [boards, setBoards] = useState<BoardState[]>([]);
    const [boardSize, setBoardSize] = useState<BoardSize>(3);
    const [gameHistory, setGameHistory] = useState<BoardState[][]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<number>(1);
    const [winner, setWinner] = useState<string>('');
    const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
    const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
    const [difficulty, setDifficulty] = useState<DifficultyLevel>(1);
    const [sessionId, setSessionId] = useState<string>('');

    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const [isUndoing, setIsUndoing] = useState<boolean>(false);
    const [isSkipping, setIsSkipping] = useState<boolean>(false);
    const [isUpdatingConfig, setIsUpdatingConfig] = useState<boolean>(false);
    const [isUpdatingDifficulty, setIsUpdatingDifficulty] = useState<boolean>(false);

    const [activeModal, setActiveModal] = useState<ComputerButtonModalType>(null);

    const { sfxMute } = useSound();
    const Coins = useCoins((state) => state.coins);
    const setCoins = useCoins((state) => state.setCoins);
    const XP = useXP((state) => state.XP);
    const user = useUser((state) => state.user);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const { canShowToast, triggerToastCooldown, resetCooldown } = useToastCooldown(TOAST_DURATION);
    const router = useRouter();

    useShortcut({
        escape: () => {
            if (activeModal) return setActiveModal(null);
            return setIsMenuOpen(false);
        },
        m: () => router.push("/"),
        r: () => handleReset(),
        c: () => setActiveModal(prev => prev === "boardConfig" ? null : "boardConfig"),
        s: () => setActiveModal(prev => prev === "soundConfig" ? null : "soundConfig"),
        d: () => setActiveModal(prev => prev === "difficulty" ? null : "difficulty"),
        q: () => setActiveModal(prev => prev === "shortcut" ? null : "shortcut"),
    });

    const initGame = async (num: BoardNumber, size: BoardSize, diff: DifficultyLevel) => {
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
        } finally {
            setIsInitializing(false);
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
                    playMoveSound(sfxMute);

                    if (data.gameOver) {
                        setWinner(data.gameState.winner);
                        setActiveModal('winner');
                        playWinSound(sfxMute);
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
        if (isResetting) return;
        setIsResetting(true);

        try {
            if (user) {
                const data = await resetGame(sessionId, await user.getIdToken());
                if (data.success) {
                    setBoards(data.gameState.boards);
                    setCurrentPlayer(data.gameState.currentPlayer);
                    setGameHistory(data.gameState.gameHistory);
                    setWinner('');
                    setActiveModal(null);
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
        } finally {
            setIsResetting(false);
        }
    };

    const handleUndo = async () => {
        if (isUndoing || Coins < 100) {
            if (Coins < 100) toast.error('Not enough coins');
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
        } finally {
            setIsUndoing(false);
        }
    };

    const handleSkip = async () => {
        if (isSkipping || Coins < 200) {
            if (Coins < 200) toast.error('Not enough coins');
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
                        setActiveModal('winner');
                        playWinSound(sfxMute);
                    }
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
        } finally {
            setIsSkipping(false);
        }
    };

    const handleBoardConfigChange = async (newNumberOfBoards: BoardNumber, newBoardSize: BoardSize) => {
        if (isUpdatingConfig) return;
        setIsUpdatingConfig(true);

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
        } finally {
            setIsUpdatingConfig(false);
        }
    };

    const handleDifficultyChange = async (level: DifficultyLevel) => {
        if (isUpdatingDifficulty) return;
        setIsUpdatingDifficulty(true);

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
        } finally {
            setIsUpdatingDifficulty(false);
        }
    };

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
                    <PlayerTurnTitle text={currentPlayer === 1 ? "Your Turn" : "Computer's Turn"} />
                </PlayerStatusContainer>

                <BoardContainer>
                    {boards.map((board, index) => (
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

            {
                isMenuOpen && (
                    <SettingOverlay>
                        <SettingContainer>
                            <SettingButton onClick={() => { handleReset(); setIsMenuOpen(false); }} disabled={isResetting} loading={isResetting}>Reset</SettingButton>
                            <SettingButton onClick={() => { setActiveModal('boardConfig'); setIsMenuOpen(false); }} disabled={isUpdatingConfig}>Game Configuration</SettingButton>
                            <SettingButton onClick={() => { handleUndo(); setIsMenuOpen(false); }} disabled={Coins < 100 || isUndoing} loading={isUndoing}>Undo (100 coins)</SettingButton>
                            <SettingButton onClick={() => { handleSkip(); setIsMenuOpen(false); }} disabled={Coins < 200 || isSkipping} loading={isSkipping}>Skip a Move (200 coins)</SettingButton>
                            <SettingButton onClick={() => handleBuyCoins(setIsProcessingPayment, canShowToast, triggerToastCooldown, resetCooldown, setCoins, Coins)} disabled={isProcessingPayment} loading={isProcessingPayment}>Buy Coins (100)</SettingButton>
                            <SettingButton onClick={() => { setActiveModal('difficulty'); setIsMenuOpen(false); }}>AI Level: {difficulty}</SettingButton>
                            <SettingButton onClick={() => { setActiveModal('soundConfig'); setIsMenuOpen(false) }}>Adjust Sound</SettingButton>
                            <SettingButton onClick={() => { setActiveModal('shortcut'); setIsMenuOpen(false) }}>Keyboard Shortcuts</SettingButton>
                            <SettingButton onClick={() => router.push('/')}>Main Menu</SettingButton>
                            <SettingButton onClick={toggleMenu}>Return to Game</SettingButton>
                        </SettingContainer>
                    </SettingOverlay>
                )
            }

            <WinnerModal
                visible={activeModal === 'winner'}
                winner={winner}
                onPlayAgain={() => { setActiveModal(null); handleReset(); }}
                onMenu={() => { setActiveModal(null); router.push('/'); }}
            />

            <BoardConfigModal
                visible={activeModal === 'boardConfig'}
                currentBoards={numberOfBoards}
                currentSize={boardSize}
                onConfirm={handleBoardConfigChange}
                onCancel={() => setActiveModal(null)}
            />

            <DifficultyModal
                visible={activeModal === 'difficulty'}
                onSelect={(level: DifficultyLevel) => {
                    handleDifficultyChange(level);
                    setActiveModal(null);
                }}
                onClose={() => setActiveModal(null)}
            />
            <SoundConfigModal
                visible={activeModal === 'soundConfig'}
                onClose={() => setActiveModal(null)}
            />
            <ShortcutModal
                visible={activeModal === 'shortcut'}
                onClose={() => setActiveModal(null)}
            />
        </GameLayout >
    );
};

export default Game;
