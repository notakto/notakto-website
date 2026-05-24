import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import type { ToastContainerProps } from "react-toastify";
import type {
	BoardNumber,
	BoardSize,
	BoardState,
	DifficultyLevel,
	GameMode,
} from "@/entities/game/model/types";
import type { Shortcut } from "@/entities/shortcut/model/types";

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
	owner?: 1 | 2;
	isLastMove?: boolean;
}

export interface BoardProps {
	boardIndex: number;
	boardState: BoardState;
	makeMove: (boardIndex: number, cellIndex: number) => void;
	isDead: boolean;
	boardSize: number;
	cellOwners?: Record<number, 1 | 2>;
	lastMoveCell?: number;
}

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

export interface WinnerModalProps extends BaseModalProps {
	winner: string;
	onPlayAgain: () => void;
	onMenu: () => void;
}

export interface TutorialModalProps extends BaseModalProps {}

export interface ProfileModalProps extends BaseModalProps {}

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

export interface GameLayoutProps extends BaseComponentProps {}

export interface ModalOverlayProps extends BaseComponentProps {}

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

export interface ProfileContainerProps extends BaseComponentProps {}

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
	owner?: 1 | 2;
}

export interface SettingButtonProps extends BaseButtonProps {
	loading?: boolean;
}

export interface SettingBarProps extends BaseButtonProps {
	text: string;
}

export interface ExitBarProps extends BaseButtonProps {
	text: string;
}

export interface CellButtonProps extends BaseButtonProps {
	isLastMove?: boolean;
	owner?: 1 | 2;
}

export interface BoardConfigButtonProps extends BaseButtonProps {
	label: string | number;
	isActive: boolean;
}

export interface DifficultyActionProps extends BaseButtonProps {
	variant: "level" | "cancel";
}

export interface PlayerTurnTitleProps {
	variant?: "normal" | "live";
	text: string;
}

export interface SoundConfigLabelProps {
	label: string;
	htmlFor: string;
}

export interface ShortcutListProps {
	shortcuts: Shortcut[];
}

export interface TutorialListProps {
	items: string[];
}

export interface CustomToastContainerProps
	extends Omit<ToastContainerProps, "toastClassName"> {
	toastClassName?: ToastContainerProps["toastClassName"];
}

export type MenuModalType =
	| "soundConfig"
	| "shortcut"
	| "tutorial"
	| "profile"
	| null;
