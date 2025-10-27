// This file contains all shared types and interfaces used across the application
// Using TypeScript utility types to reduce duplication and improve maintainability

import type { User } from "firebase/auth";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import type { ToastContainerProps } from "react-toastify";

// CORE GAME TYPES

export type BoardState = Array<string>;
export type GameMode = "vsComputer" | "vsPlayer" | "liveMatch" | null;
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type BoardSize = 2 | 3 | 4 | 5;
export type BoardNumber = 1 | 2 | 3 | 4 | 5;

// GAME STATE INTERFACES

export interface GameState {
	boards: BoardState[];
	currentPlayer: 1 | 2;
	winner: string;
	boardSize: BoardSize;
	numberOfBoards: BoardNumber;
	difficulty: DifficultyLevel;
	gameHistory: BoardState[][];
	sessionId: string;
	gameOver?: boolean;
}

// API RESPONSE INTERFACES

export interface BaseApiResponse {
	success: boolean;
}

export interface ErrorResponse {
	success: false;
	error: string;
}

export interface NewGameResponse extends BaseApiResponse {
	sessionId: string;
	gameState: GameState;
}

export interface GameStateResponse extends BaseApiResponse {
	gameState: GameState;
}

export interface MakeMoveResponse extends GameStateResponse {
	gameOver: boolean;
}

export interface ResetGameResponse extends GameStateResponse {}

export interface UpdateConfigResponse extends BaseApiResponse {
	sessionId: string;
	gameState: GameState;
}

export interface UndoMoveResponse extends UpdateConfigResponse {}

export interface SkipMoveResponse extends GameStateResponse {
	gameOver?: boolean;
}

// ZUSTAND STORE TYPES

export interface SoundStore {
	bgMute: boolean;
	bgVolume: number;
	sfxMute: boolean;
	sfxVolume: number;
	setBgMute: (mute: boolean) => void;
	setBgVolume: (vol: number) => void;
	setSfxMute: (mute: boolean) => void;
	setSfxVolume: (vol: number) => void;
}

export interface UserStore {
	user: User | null;
	setUser: (newUser: User | null) => void;
}

export interface CoinStore {
	coins: number;
	setCoins: (newCoins: number) => void;
	optimisticAddCoins: (amount: number) => void;
}

export interface XPStore {
	XP: number;
	setXP: (newXP: number) => void;
	optimisticAddXP: (amount: number) => void;
}

// COMPONENT PROP INTERFACES

// Base component props
export interface BaseComponentProps {
	children?: ReactNode;
	className?: string;
}

export interface BaseButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
}

export interface BaseModalProps {
	visible: boolean;
	onClose?: () => void;
}

// Game-related component props
export interface GameBoardProps {
	boards: Array<Array<string>>;
	makeMove: (boardIndex: number, cellIndex: number) => void;
	isBoardDead: (board: Array<string>) => boolean;
	boardSize: number;
}

export interface GameProps {
	currentPlayer: string;
	boards: string[][];
	makeMove: (boardIndex: number, cellIndex: number) => void;
	isBoardDead: (board: string[]) => boolean;
	undoMove: () => void;
	resetGame: () => void;
	exitToMenu: () => void;
	gameMode: GameMode;
	numberOfBoards: number;
	onBoardConfigPress: () => void;
	difficulty?: number;
	onDifficultyPress?: () => void;
	boardSize: number;
	onResetNames: () => void;
	onUndo: () => void;
	onSkip: () => void;
	coins: number;
	experience: number;
	canUndo: boolean;
	canSkip: boolean;
	gameHistoryLength: number;
	toggleMute: () => void;
	isMuted: boolean;
	onAddCoins?: (amount: number) => void;
}

export interface CellProps {
	boardIndex: number;
	cellIndex: number;
	value: string;
	onPress: (boardIndex: number, cellIndex: number) => void;
	disabled: boolean;
	boardSize: number;
}

export interface BoardProps {
	boardIndex: number;
	boardState: BoardState;
	makeMove: (boardIndex: number, cellIndex: number) => void;
	isDead: boolean;
	boardSize: number;
}

// Menu and navigation props
export interface MenuProps {
	startGame: (mode: "vsPlayer" | "vsComputer" | "liveMatch") => void;
	showTutorial: () => void;
	signed: boolean;
	signIn: () => void;
	signOut: () => void;
	toggleMute: () => void;
	isMuted: boolean;
}

export interface LiveProps {
	onClose: () => void;
}

// Modal prop interfaces
export interface WinnerModalProps extends BaseModalProps {
	winner: string;
	onPlayAgain: () => void;
	onMenu: () => void;
}

export interface TutorialModalProps extends BaseModalProps {}

export interface PlayerNamesModalProps extends BaseModalProps {
	onSubmit: (p1: string, p2: string) => void;
	initialNames?: [string, string];
}

export interface DifficultyModalProps extends BaseModalProps {
	onSelect: (level: DifficultyLevel) => void;
}

export interface BoardConfigModalProps extends BaseModalProps {
	currentBoards: BoardNumber;
	currentSize: BoardSize;
	onConfirm: (num: BoardNumber, size: BoardSize) => void;
	onCancel: () => void;
}

export interface SoundConfigModalProps extends BaseModalProps {}

export interface ShortcutModalProps extends BaseModalProps {}

// UI COMPONENT INTERFACES

// Layout components
export interface GameLayoutProps extends BaseComponentProps {}

export interface ModalOverlayProps extends BaseComponentProps {}

// Container components
export interface BoardContainerProps extends BaseComponentProps {}

export interface BoardWrapperProps extends BaseComponentProps {}

export interface SingleBoardContainerProps extends BaseComponentProps {
	isDead: boolean;
}

export interface BoardGridProps extends BaseComponentProps {
	boardSize: number;
}

export interface GameBoardAreaProps extends BaseComponentProps {}

export interface PlayerStatusContainerProps extends BaseComponentProps {}

export interface StatContainerProps extends BaseComponentProps {}

export interface MenuContainerProps extends BaseComponentProps {}

export interface MenuButtonContainerProps extends BaseComponentProps {}

export interface SettingContainerProps extends BaseComponentProps {}

export interface SettingOverlayProps extends BaseComponentProps {}

export interface TutorialContainerProps extends BaseComponentProps {}

export interface SoundConfigContainerProps extends BaseComponentProps {}

export interface SoundConfigSectionProps extends BaseComponentProps {}

export interface SoundConfigControlsProps extends BaseComponentProps {}

export interface ShortcutContainerProps extends BaseComponentProps {}

export interface DifficultyContainerProps extends BaseComponentProps {}

export interface BoardConfigContainerProps extends BaseComponentProps {}

export interface BoardConfigOptionsProps extends BaseComponentProps {}

export interface BoardConfigActionProps extends BaseComponentProps {}

export interface WinnerContainerProps extends BaseComponentProps {}

export interface WinnerActionProps extends BaseComponentProps {}

export interface PlayerNameContainerProps extends BaseComponentProps {}

export interface PlayerNameFormProps extends BaseComponentProps {}

// Live match components
export interface LiveContainerProps extends BaseComponentProps {}

export interface BoardGridContainerProps extends BaseComponentProps {}

export interface BoardLiveContainerProps extends BaseComponentProps {
	blocked: boolean;
}

export interface BoardCellProps {
	value: string;
	onClick: MouseEventHandler<HTMLButtonElement>;
	disabled: boolean;
}

export interface SearchContainerProps extends BaseComponentProps {}

export interface CellValueDisplayProps {
	value: string | null;
}

// Button components
export interface SettingButtonProps extends BaseButtonProps {
	loading?: boolean;
}

export interface SettingBarProps extends BaseButtonProps {
	text: string;
}

export interface ExitBarProps extends BaseButtonProps {
	text: string;
}

export interface CellButtonProps extends BaseButtonProps {}

export interface BoardConfigButtonProps extends BaseButtonProps {
	label: string | number;
	isActive: boolean;
}

export interface DifficultyActionProps extends BaseButtonProps {
	variant: "level" | "cancel";
}

// Title and text components
export interface AnimatedTitleProps {
	text: string;
	className?: string;
	textClassName?: string;
}

export interface PlayerTurnTitleProps {
	variant?: "normal" | "live";
	text: string;
}

export interface SoundConfigLabelProps {
	label: string;
	htmlFor: string;
}

// List components
export interface Shortcut {
	key: string;
	action: string;
}

export interface ShortcutListProps {
	shortcuts: Shortcut[];
}

export interface TutorialListProps {
	items: string[];
}

// Toast components
export interface CustomToastContainerProps
	extends Omit<ToastContainerProps, "toastClassName"> {
	toastClassName?: ToastContainerProps["toastClassName"];
}

// HOOK TYPES

export type ShortcutHandler = (event: KeyboardEvent) => void;
export type ShortcutMap = Record<string, ShortcutHandler>;

// MODAL TYPE UNIONS

export type PlayerButtonModalType =
	| "names"
	| "winner"
	| "boardConfig"
	| "soundConfig"
	| "shortcut"
	| null;

export type ComputerButtonModalType =
	| "winner"
	| "boardConfig"
	| "soundConfig"
	| "difficulty"
	| "shortcut"
	| null;

export type MenuModalType = "soundConfig" | "shortcut" | "tutorial" | null;
