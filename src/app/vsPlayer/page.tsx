// Note: This is the consolidated monolithic version of the vsPlayer page
// Original: ~25 components, 4 modals, 5 services files
// Consolidated: 2,300+ lines, completely self-contained

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";

// ============================================
// TYPES
// ============================================

type BoardState = Array<string>;
type BoardSize = 2 | 3 | 4 | 5;
type BoardNumber = 1 | 2 | 3 | 4 | 5;

interface MoveLogEntry {
	player: 1 | 2;
	board: number;
	cell: number;
}

// ============================================
// CONSTANTS
// ============================================

const TOAST_DURATION = 4000;
const TOAST_IDS = {
	User: {
		SignInError: "auth/sign-in-error",
	},
	PlayerNames: {
		Duplicate: "player-names/duplicate",
	},
} as const;

// ============================================
// STORES
// ============================================

type GlobalModalType =
	| "soundConfig"
	| "shortcut"
	| "tutorial"
	| "profile"
	| "resetConfirmation"
	| "exitConfirmation"
	| "boardConfig"
	| "difficulty"
	| "names"
	| "winner"
	| null;

interface GlobalModalStore {
	activeModal: GlobalModalType;
	openModal: (modal: GlobalModalType) => void;
	closeModal: () => void;
}

const useGlobalModal = create<GlobalModalStore>((set) => ({
	activeModal: null,
	openModal: (modal) => set({ activeModal: modal }),
	closeModal: () => set({ activeModal: null }),
}));

interface SoundStore {
	sfxMute: boolean;
	setSfxMute: (mute: boolean) => void;
}

const useSound = create<SoundStore>((set) => ({
	sfxMute: false,
	setSfxMute: (mute) => set({ sfxMute: mute }),
}));

// ============================================
// SOUND SERVICES
// ============================================

let moveAudio: HTMLAudioElement | null = null;
let winAudio: HTMLAudioElement | null = null;

const playMoveSound = (mute: boolean) => {
	if (mute) return;
	if (!moveAudio) {
		moveAudio = new Audio("/sounds/click.mp3");
	}
	moveAudio.currentTime = 0;
	moveAudio.play().catch(console.error);
};

const playWinSound = (mute: boolean) => {
	if (mute) return;
	if (!winAudio) {
		winAudio = new Audio("/sounds/wins.mp3");
	}
	winAudio.currentTime = 0;
	winAudio.play().catch(console.error);
};

// ============================================
// GAME LOGIC
// ============================================

const isBoardDead = (board: BoardState, boardSize: number) => {
	const size = boardSize;
	for (let i = 0; i < size; i++) {
		const row = board.slice(i * size, (i + 1) * size);
		const col = Array.from({ length: size }, (_, j) => board[i + j * size]);
		if (row.every((c) => c === "X") || col.every((c) => c === "X")) return true;
	}
	const diag1 = Array.from({ length: size }, (_, i) => board[i * (size + 1)]);
	const diag2 = Array.from(
		{ length: size },
		(_, i) => board[(i + 1) * (size - 1)],
	);
	return diag1.every((c) => c === "X") || diag2.every((c) => c === "X");
};

// ============================================
// HOOKS
// ============================================

function useShortcut(
	shortcuts: Record<string, (event: KeyboardEvent) => void>,
	disabled: boolean = false,
) {
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const key = e.key.toLowerCase();
			if (disabled && key !== "escape") return;

			const el = e.target as HTMLElement | null;
			const tag = el?.tagName?.toLowerCase();

			if (e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey)
				return;
			if (tag === "input" || tag === "textarea" || el?.isContentEditable)
				return;

			if (shortcuts[key]) {
				e.preventDefault();
				shortcuts[key](e);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [shortcuts, disabled]);
}

function useToastCooldown(cooldown: number = TOAST_DURATION) {
	const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOnCooldown = useRef(false);

	const canShowToast = useCallback(() => !isOnCooldown.current, []);

	const triggerToastCooldown = useCallback(() => {
		isOnCooldown.current = true;

		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}
		cooldownTimer.current = setTimeout(() => {
			isOnCooldown.current = false;
			cooldownTimer.current = null;
		}, cooldown);
	}, [cooldown]);

	const resetCooldown = useCallback(() => {
		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}
		cooldownTimer.current = null;
		isOnCooldown.current = false;
	}, []);

	return { canShowToast, triggerToastCooldown, resetCooldown };
}

// ============================================
// UI COMPONENTS
// ============================================

// Modal Overlay
function ModalOverlay({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				backgroundColor: "rgba(14, 14, 26, 0.9)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				zIndex: 9999,
				padding: "1rem",
			}}>
			{children}
		</div>
	);
}

// Cell Button
function CellButton({
	children,
	onClick,
	disabled,
	isLastMove,
	owner,
}: {
	children: React.ReactNode;
	onClick: () => void;
	disabled: boolean;
	isLastMove?: boolean;
	owner?: 1 | 2;
}) {
	const baseStyle: React.CSSProperties = {
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		aspectRatio: "1",
		width: "100%",
		border: "1px solid",
		borderColor: "#2c2c44",
		backgroundColor: "#14141e",
		cursor: disabled ? "not-allowed" : "pointer",
	};

	if (isLastMove) {
		baseStyle.borderWidth = "2px";
		if (owner === 2) {
			baseStyle.borderColor = "#facc15";
			baseStyle.boxShadow = "inset 0 0 8px rgba(250, 204, 21, 0.4)";
		} else {
			baseStyle.borderColor = "#c43c3c";
			baseStyle.boxShadow = "inset 0 0 8px rgba(196, 60, 60, 0.4)";
		}
	}

	if (disabled) {
		baseStyle.backgroundColor = "#2a2a3a";
	}

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			style={baseStyle}>
			{children}
		</button>
	);
}

// Cell Value Display
function CellValueDisplay({
	value,
	owner,
}: {
	value: string | null;
	owner?: 1 | 2;
}) {
	if (!value) return null;

	const baseStyle: React.CSSProperties = {
		position: "absolute",
		inset: 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontSize: "1.25rem",
		lineHeight: 1,
		fontFamily: '"Press Start 2P", monospace',
	};

	if (owner === 2) {
		baseStyle.color = "#facc15";
		baseStyle.textShadow = "0 0 4px rgba(250, 204, 21, 0.6)";
	} else {
		baseStyle.color = "#c43c3c";
		baseStyle.textShadow = "0 0 4px rgba(196, 60, 60, 0.6)";
	}

	return <div style={baseStyle}>{value}</div>;
}

// Cell Component
function Cell({
	boardIndex,
	cellIndex,
	value,
	onPress,
	disabled,
	owner,
	isLastMove,
}: {
	boardIndex: number;
	cellIndex: number;
	value: string;
	onPress: (boardIndex: number, cellIndex: number) => void;
	disabled: boolean;
	owner?: 1 | 2;
	isLastMove?: boolean;
}) {
	const handleClick = () => onPress(boardIndex, cellIndex);
	const isDisabled = disabled || !!value;

	return (
		<CellButton
			onClick={handleClick}
			disabled={isDisabled}
			isLastMove={isLastMove}
			owner={owner}>
			<CellValueDisplay value={value} owner={owner} />
		</CellButton>
	);
}

// Board Grid
function BoardGrid({
	children,
	boardSize,
}: {
	children: React.ReactNode;
	boardSize: number;
}) {
	const gridStyle: React.CSSProperties = {
		display: "grid",
		gap: "0.25rem",
		width: "100%",
		aspectRatio: "1",
		gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
	};

	return <div style={gridStyle}>{children}</div>;
}

// Single Board Container
function SingleBoardContainer({
	children,
	isDead,
}: {
	children: React.ReactNode;
	isDead: boolean;
}) {
	const style: React.CSSProperties = {
		flex: 1,
		padding: "0.5rem",
		maxWidth: "100%",
		opacity: isDead ? 0.6 : 1,
	};

	return <div style={style}>{children}</div>;
}

// Board Component
function Board({
	boardIndex,
	boardState,
	makeMove,
	isDead,
	boardSize,
	cellOwners,
	lastMoveCell,
}: {
	boardIndex: number;
	boardState: BoardState;
	makeMove: (boardIndex: number, cellIndex: number) => void;
	isDead: boolean;
	boardSize: number;
	cellOwners?: Record<number, 1 | 2>;
	lastMoveCell?: number;
}) {
	return (
		<SingleBoardContainer isDead={isDead}>
			<BoardGrid boardSize={boardSize}>
				{[...boardState.entries()].map(([cellIndex, cell]) => (
					<Cell
						key={`${boardIndex}-${cellIndex}-${cell}`}
						boardIndex={boardIndex}
						cellIndex={cellIndex}
						value={cell}
						onPress={makeMove}
						disabled={isDead}
						owner={cellOwners?.[cellIndex]}
						isLastMove={cellIndex === lastMoveCell}
					/>
				))}{" "}
			</BoardGrid>
		</SingleBoardContainer>
	);
}

// Board Display
function BoardDisplay({
	visible,
	children,
}: {
	visible: boolean;
	children: React.ReactNode;
}) {
	if (!visible) return null;

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "300px",
			}}>
			{children}
		</div>
	);
}

// Game Layout
function GameLayout({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				backgroundColor: "#0e0e1a",
			}}>
			{children}
		</div>
	);
}

// Game Content Area
function GameContentArea({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				flex: 1,
				padding: "1rem",
				gap: "1rem",
			}}>
			{children}
		</div>
	);
}

// Game Center Column
function GameCenterColumn({
	children,
	mobileBoardSelector,
}: {
	children: React.ReactNode;
	mobileBoardSelector?: React.ReactNode;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				flex: 1,
				minWidth: 0,
			}}>
			{mobileBoardSelector}
			{children}
		</div>
	);
}

// Game Left Panel
function GameLeftPanel({ children }: { children: React.ReactNode }) {
	return (
		<div
			style={{
				display: "none",
				flexDirection: "column",
				gap: "0.5rem",
				flex: 1,
				maxWidth: "300px",
			}}
			className="md:flex">
			{children}
		</div>
	);
}

// Game Top Bar
function GameTopBar({
	player1,
	player2,
	currentPlayer,
	boards,
	boardSize,
	gameOver,
	mode,
}: {
	player1: { name: string; moveCount: number };
	player2: { name: string; moveCount: number };
	currentPlayer: 1 | 2;
	boards: BoardState[];
	boardSize: number;
	gameOver: boolean;
	mode: string;
}) {
	const containerStyle: React.CSSProperties = {
		backgroundColor: "#1e1e32",
		border: "3px solid #3a3a56",
		boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
		padding: "0.75rem 1rem",
		marginBottom: "0.5rem",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		flexWrap: "wrap",
		gap: "1rem",
	};

	const playerStyle: React.CSSProperties = {
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.5rem",
		color: "#e4d8c0",
	};

	const activePlayerStyle: React.CSSProperties = {
		...playerStyle,
		color: "#c43c3c",
		textShadow: "2px 2px 0 #0e0e1a",
	};

	return (
		<div style={containerStyle}>
			<div style={currentPlayer === 1 ? activePlayerStyle : playerStyle}>
				{player1.name}: {player1.moveCount}
			</div>
			<div
				style={{
					fontSize: "0.4rem",
					color: "#6e6e88",
					fontFamily: '"Press Start 2P", monospace',
				}}>
				VS
			</div>
			<div style={currentPlayer === 2 ? activePlayerStyle : playerStyle}>
				{player2.name}: {player2.moveCount}
			</div>
		</div>
	);
}

// Game Status Bar
function GameStatusBar({
	currentPlayer,
	moveCount,
	gameOver,
	mode,
	player1Name,
	player2Name,
}: {
	currentPlayer: 1 | 2;
	moveCount: number;
	gameOver: boolean;
	mode: string;
	player1Name: string;
	player2Name: string;
}) {
	const containerStyle: React.CSSProperties = {
		backgroundColor: "#1e1e32",
		border: "3px solid #3a3a56",
		padding: "0.5rem",
		marginBottom: "1rem",
		textAlign: "center",
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.4rem",
		color: "#e4d8c0",
	};

	const playerName = currentPlayer === 1 ? player1Name : player2Name;

	return (
		<div style={containerStyle}>
			{gameOver ? "GAME OVER" : `${playerName}'S TURN`} ({moveCount} moves)
		</div>
	);
}

// Board Selector
function BoardSelector({
	boards,
	boardSize,
	selectedBoard,
	onSelectBoard,
}: {
	boards: BoardState[];
	boardSize: number;
	selectedBoard: number;
	onSelectBoard: (index: number) => void;
}) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "0.5rem",
			}}>
			{boards.map((board, index) => {
				const isDead = isBoardDead(board, boardSize);
				const baseStyle: React.CSSProperties = {
					border: "3px solid",
					borderColor: isDead
						? "#3a3a4a"
						: selectedBoard === index
							? "#c8a040"
							: "#3a3a56",
					boxShadow:
						selectedBoard === index
							? "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a"
							: "inset 0 0 0 1px #0e0e1a",
					backgroundColor: "#1e1e32",
					padding: "0.5rem",
					cursor: "pointer",
					opacity: isDead ? 0.6 : 1,
					transition: "all 0.15s",
				};

				return (
					<div
						key={index}
						style={baseStyle}
						onClick={() => onSelectBoard(index)}>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.4rem",
								color: "#e4d8c0",
								textAlign: "center",
							}}>
							BOARD {index + 1}
						</div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
								gap: "2px",
								marginTop: "0.25rem",
							}}>
							{board.slice(0, boardSize * boardSize).map((cell, cellIndex) => (
								<div
									key={cellIndex}
									style={{
										aspectRatio: "1",
										backgroundColor: cell === "X" ? "#c43c3c" : "#14141e",
										fontSize: "0.3rem",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#e4d8c0",
									}}>
									{cell}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}

// Board Preview Grid
function BoardPreviewGrid({
	boards,
	boardSize,
	moveLog,
	onSelectBoard,
}: {
	boards: BoardState[];
	boardSize: number;
	moveLog: MoveLogEntry[];
	onSelectBoard: (index: number) => void;
}) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
				gap: "1rem",
				width: "100%",
			}}>
			{boards.map((board, index) => {
				const isDead = isBoardDead(board, boardSize);
				const baseStyle: React.CSSProperties = {
					border: "3px solid #3a3a56",
					boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
					backgroundColor: "#1e1e32",
					padding: "0.5rem",
					opacity: isDead ? 0.6 : 1,
					cursor: "pointer",
				};

				return (
					<div
						key={index}
						style={baseStyle}
						onClick={() => onSelectBoard(index)}>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.4rem",
								color: "#e4d8c0",
								textAlign: "center",
								marginBottom: "0.5rem",
							}}>
							BOARD {index + 1} {isDead ? "(DEAD)" : ""}
						</div>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
								gap: "2px",
							}}>
							{board.slice(0, boardSize * boardSize).map((cell, cellIndex) => (
								<div
									key={cellIndex}
									style={{
										aspectRatio: "1",
										backgroundColor: cell === "X" ? "#c43c3c" : "#14141e",
										fontSize: "0.3rem",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "#e4d8c0",
									}}>
									{cell}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}

// Game Stats Panel
function GameStatsPanel({
	stats,
	moveLog,
	boardSize,
}: {
	stats: { label: string; value: string | number }[];
	moveLog: MoveLogEntry[];
	boardSize: number;
}) {
	return (
		<div
			style={{
				display: "none",
				flexDirection: "column",
				gap: "0.5rem",
				flex: 1,
				maxWidth: "300px",
			}}
			className="md:flex">
			{stats.map((stat) => (
				<div
					key={stat.label}
					style={{
						backgroundColor: "#1e1e32",
						border: "3px solid #3a3a56",
						boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
						padding: "0.75rem",
						textAlign: "center",
					}}>
					<div
						style={{
							fontFamily: '"Press Start 2P", monospace',
							fontSize: "0.3rem",
							color: "#6e6e88",
							marginBottom: "0.25rem",
						}}>
						{stat.label}
					</div>
					<div
						style={{
							fontFamily: '"Press Start 2P", monospace',
							fontSize: "0.5rem",
							color: "#e4d8c0",
						}}>
						{stat.value}
					</div>
				</div>
			))}
		</div>
	);
}

// Game Action Bar
function GameActionBar({
	actions,
}: {
	actions: {
		label: string;
		onClick: () => void;
		variant: "primary" | "danger" | "secondary";
	}[];
}) {
	const buttonStyle: React.CSSProperties = {
		flex: 1,
		padding: "0.5rem",
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.35rem",
		color: "#e4d8c0",
		textTransform: "uppercase",
		letterSpacing: "0.05em",
		border: "3px solid",
		boxShadow: "3px 3px 0 #0e0e1a",
		cursor: "pointer",
	};

	const getVariantStyle = (variant: string) => {
		switch (variant) {
			case "primary":
				return { backgroundColor: "#c43c3c", borderColor: "#4e4e6a" };
			case "danger":
				return { backgroundColor: "#c43c3c", borderColor: "#4e4e6a" };
			default:
				return { backgroundColor: "#222238", borderColor: "#3a3a56" };
		}
	};

	return (
		<div
			style={{
				display: "flex",
				gap: "0.5rem",
				padding: "1rem",
				backgroundColor: "#0e0e1a",
			}}>
			{actions.map((action, index) => (
				<button
					key={index}
					type="button"
					onClick={action.onClick}
					style={{
						...buttonStyle,
						...getVariantStyle(action.variant),
					}}>
					{action.label}
				</button>
			))}
		</div>
	);
}

// ============================================
// MODALS
// ============================================

// Player Names Modal
function PlayerNamesModal({
	visible,
	onSubmit,
	onClose,
	initialNames = ["Player 1", "Player 2"],
}: {
	visible: boolean;
	onSubmit: (p1: string, p2: string) => void;
	onClose?: () => void;
	initialNames?: [string, string];
}) {
	const [player1, setPlayer1] = useState(initialNames[0] || "Player 1");
	const [player2, setPlayer2] = useState(initialNames[1] || "Player 2");

	const { canShowToast, triggerToastCooldown, resetCooldown } =
		useToastCooldown(TOAST_DURATION);

	useEffect(() => {
		setPlayer1(initialNames[0] || "Player 1");
		setPlayer2(initialNames[1] || "Player 2");
	}, [initialNames]);

	const handleSubmit = () => {
		if (!canShowToast()) return;

		if (player1.trim().toLowerCase() === player2.trim().toLowerCase()) {
			toast("Player 1 and Player 2 cannot have the same name.", {
				toastId: TOAST_IDS.PlayerNames.Duplicate,
				autoClose: TOAST_DURATION,
				onClose: resetCooldown,
			});
			triggerToastCooldown();
			return;
		}
		toast.dismiss(TOAST_IDS.PlayerNames.Duplicate);
		resetCooldown();

		onSubmit(player1 || "Player 1", player2 || "Player 2");
	};

	if (!visible) return null;

	const MAX_PLAYER_NAME_LENGTH = 15;
	const containerStyle: React.CSSProperties = {
		backgroundColor: "#1e1e32",
		border: "3px solid #3a3a56",
		boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
		padding: "1rem 1.5rem",
		width: "95%",
		maxWidth: "400px",
		textAlign: "center",
	};

	const titleStyle: React.CSSProperties = {
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.4rem",
		color: "#c43c3c",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		marginBottom: "1rem",
	};

	const inputStyle: React.CSSProperties = {
		width: "100%",
		padding: "0.5rem",
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.35rem",
		color: "#e4d8c0",
		backgroundColor: "#0e0e1a",
		border: "3px solid #3a3a56",
		boxShadow: "inset 0 0 0 1px #0e0e1a",
	};

	const buttonStyle: React.CSSProperties = {
		backgroundColor: "#c43c3c",
		color: "#e4d8c0",
		padding: "0.75rem",
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.4rem",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		border: "3px solid #4e4e6a",
		boxShadow: "3px 3px 0 #0e0e1a",
		cursor: "pointer",
		width: "100%",
	};

	return (
		<ModalOverlay>
			<div style={containerStyle}>
				<div style={titleStyle}>Enter Player Names</div>
				<div
					style={{
						marginBottom: "1rem",
						display: "flex",
						flexDirection: "column",
						gap: "0.75rem",
					}}>
					<div>
						<input
							type="text"
							value={player1}
							onChange={(e) => setPlayer1(e.target.value)}
							placeholder="Player 1 Name"
							maxLength={MAX_PLAYER_NAME_LENGTH}
							style={inputStyle}
						/>
						<div
							style={{
								fontSize: "0.3rem",
								color: "#a89878",
								fontFamily: '"Press Start 2P", monospace',
								marginTop: "0.25rem",
								textAlign: "right",
							}}>
							{player1.length}/{MAX_PLAYER_NAME_LENGTH}
						</div>
					</div>

					<div>
						<input
							type="text"
							value={player2}
							onChange={(e) => setPlayer2(e.target.value)}
							placeholder="Player 2 Name"
							maxLength={MAX_PLAYER_NAME_LENGTH}
							style={inputStyle}
						/>
						<div
							style={{
								fontSize: "0.3rem",
								color: "#a89878",
								fontFamily: '"Press Start 2P", monospace',
								marginTop: "0.25rem",
								textAlign: "right",
							}}>
							{player2.length}/{MAX_PLAYER_NAME_LENGTH}
						</div>
					</div>
				</div>

				<div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
					<button type="button" onClick={handleSubmit} style={buttonStyle}>
						Start Game
					</button>
					{onClose && (
						<button
							type="button"
							onClick={onClose}
							style={{
								...buttonStyle,
								backgroundColor: "#222238",
								borderColor: "#3a3a56",
							}}>
							Cancel
						</button>
					)}
				</div>
			</div>
		</ModalOverlay>
	);
}

// Winner Modal
function WinnerModal({
	visible,
	winner,
	onPlayAgain,
	onMenu,
}: {
	visible: boolean;
	winner: string;
	onPlayAgain: () => void;
	onMenu: () => void;
}) {
	if (!visible) return null;

	const containerStyle: React.CSSProperties = {
		backgroundColor: "#1e1e32",
		border: "3px solid #3a3a56",
		boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
		padding: "1rem 1.5rem",
		width: "95%",
		maxWidth: "400px",
		textAlign: "center",
	};

	const titleStyle: React.CSSProperties = {
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.5rem",
		color: "#c43c3c",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		marginBottom: "1rem",
	};

	const messageStyle: React.CSSProperties = {
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.4rem",
		color: "#e4d8c0",
		marginBottom: "1.5rem",
	};

	const buttonStyle: React.CSSProperties = {
		backgroundColor: "#c43c3c",
		color: "#e4d8c0",
		padding: "0.5rem 1rem",
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.35rem",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		border: "3px solid #4e4e6a",
		boxShadow: "3px 3px 0 #0e0e1a",
		cursor: "pointer",
		flex: 1,
	};

	return (
		<ModalOverlay>
			<div style={containerStyle}>
				<div style={titleStyle}>Game Over!</div>
				<div style={messageStyle}>
					{winner === "You" ? "You won!" : `${winner} wins`}
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						gap: "1rem",
					}}>
					<button type="button" onClick={onPlayAgain} style={buttonStyle}>
						Play Again
					</button>
					<button type="button" onClick={onMenu} style={buttonStyle}>
						Main Menu
					</button>
				</div>
			</div>
		</ModalOverlay>
	);
}

// Board Config Modal
function BoardConfigModal({
	visible,
	currentBoards,
	currentSize,
	onConfirm,
	onCancel,
}: {
	visible: boolean;
	currentBoards: BoardNumber;
	currentSize: BoardSize;
	onConfirm: (num: BoardNumber, size: BoardSize) => void;
	onCancel: () => void;
}) {
	const [selectedBoards, setSelectedBoards] =
		useState<BoardNumber>(currentBoards);
	const [selectedSize, setSelectedSize] = useState<BoardSize>(currentSize);
	const BoardNumbers: BoardNumber[] = [1, 2, 3, 4, 5];
	const BoardSizes: BoardSize[] = [2, 3, 4, 5];

	if (!visible) return null;

	const containerStyle: React.CSSProperties = {
		backgroundColor: "#1e1e32",
		border: "3px solid #3a3a56",
		boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
		padding: "1rem 1.5rem",
		width: "95%",
		maxWidth: "500px",
		textAlign: "center",
	};

	const titleStyle: React.CSSProperties = {
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.4rem",
		color: "#c43c3c",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		marginBottom: "1rem",
	};

	const buttonStyle: React.CSSProperties = {
		minWidth: "60px",
		padding: "0.5rem 1rem",
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.35rem",
		color: "#e4d8c0",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		border: "3px solid",
		boxShadow: "3px 3px 0 #0e0e1a",
		cursor: "pointer",
	};

	const getButtonStyle = (isActive: boolean) => {
		return isActive
			? { ...buttonStyle, backgroundColor: "#c43c3c", borderColor: "#c43c3c" }
			: { ...buttonStyle, backgroundColor: "#222238", borderColor: "#3a3a56" };
	};

	return (
		<ModalOverlay>
			<div style={containerStyle}>
				<div style={titleStyle}>Number of Boards</div>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "0.5rem",
						justifyContent: "center",
						marginBottom: "1.5rem",
					}}>
					{BoardNumbers.map((num) => (
						<button
							type="button"
							key={num}
							onClick={() => setSelectedBoards(num)}
							style={getButtonStyle(selectedBoards === num)}>
							{num}
						</button>
					))}
				</div>

				<div style={titleStyle}>Board Size</div>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "0.5rem",
						justifyContent: "center",
						marginBottom: "1.5rem",
					}}>
					{BoardSizes.map((size) => (
						<button
							type="button"
							key={size}
							onClick={() => setSelectedSize(size)}
							style={getButtonStyle(selectedSize === size)}>
							{size}x{size}
						</button>
					))}
				</div>

				<div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
					<button
						type="button"
						onClick={onCancel}
						style={{
							...buttonStyle,
							...getButtonStyle(false),
							flex: 1,
						}}>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => onConfirm(selectedBoards, selectedSize)}
						style={{
							...buttonStyle,
							...getButtonStyle(true),
							flex: 1,
						}}>
						Apply
					</button>
				</div>
			</div>
		</ModalOverlay>
	);
}

// Confirmation Modal
function ConfirmationModal({
	visible,
	title,
	message,
	onConfirm,
	onCancel,
	confirmText = "Confirm",
	cancelText = "Cancel",
}: {
	visible: boolean;
	title: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	confirmText?: string;
	cancelText?: string;
}) {
	if (!visible) return null;

	const containerStyle: React.CSSProperties = {
		backgroundColor: "#1e1e32",
		border: "3px solid #3a3a56",
		boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
		padding: "1rem 1.5rem",
		width: "95%",
		maxWidth: "400px",
		textAlign: "center",
	};

	const titleStyle: React.CSSProperties = {
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.4rem",
		color: "#c43c3c",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		marginBottom: "0.5rem",
	};

	const messageStyle: React.CSSProperties = {
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.35rem",
		color: "#e4d8c0",
		margin: "1.5rem 0",
	};

	const buttonStyle: React.CSSProperties = {
		padding: "0.5rem 2rem",
		fontFamily: '"Press Start 2P", monospace',
		fontSize: "0.35rem",
		color: "#e4d8c0",
		textTransform: "uppercase",
		letterSpacing: "0.1em",
		border: "3px solid",
		boxShadow: "3px 3px 0 #0e0e1a",
		cursor: "pointer",
		flex: 1,
	};

	return (
		<ModalOverlay>
			<div style={containerStyle}>
				<div style={titleStyle}>{title}</div>
				<div style={messageStyle}>{message}</div>
				<div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
					<button
						type="button"
						onClick={onConfirm}
						style={{
							...buttonStyle,
							backgroundColor: "#c43c3c",
							borderColor: "#4e4e6a",
						}}>
						{confirmText}
					</button>
					<button
						type="button"
						onClick={onCancel}
						style={{
							...buttonStyle,
							backgroundColor: "#222238",
							borderColor: "#3a3a56",
						}}>
						{cancelText}
					</button>
				</div>
			</div>
		</ModalOverlay>
	);
}

// ============================================
// MAIN GAME COMPONENT
// ============================================

const Game = () => {
	const [boards, setBoards] = useState<BoardState[]>([]);
	const [boardSize, setBoardSize] = useState<BoardSize>(3);
	const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
	const [player1Name, setPlayer1Name] = useState<string>("Player 1");
	const [player2Name, setPlayer2Name] = useState<string>("Player 2");
	const [winner, setWinner] = useState<string>("");
	const [numberOfBoards, setNumberOfBoards] = useState<BoardNumber>(3);
	const [gameStarted, setGameStarted] = useState<boolean>(false);
	const [initialSetupDone, setInitialSetupDone] = useState<boolean>(false);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);
	const [selectedBoard, setSelectedBoard] = useState(0);
	const [showPreview, setShowPreview] = useState(false);
	const [moveLog, setMoveLog] = useState<MoveLogEntry[]>([]);
	const startTimeRef = useRef<number>(Date.now());
	const [elapsed, setElapsed] = useState(0);

	const { activeModal, openModal, closeModal } = useGlobalModal();
	const { sfxMute } = useSound();
	const router = useRouter();

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally run only on mount
	useEffect(() => {
		openModal("names");
	}, []);

	// Elapsed time tracker
	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, [gameStarted]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	useShortcut(
		{
			escape: () => {
				if ((!initialSetupDone && !gameStarted) || activeModal === "winner")
					return;
				if (activeModal) return closeModal();
			},
			m: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "exitConfirmation"
					? closeModal()
					: openModal("exitConfirmation");
			},
			r: () => {
				if (!initialSetupDone || !hasMoveHappened || activeModal === "winner")
					return;
				activeModal === "resetConfirmation"
					? closeModal()
					: openModal("resetConfirmation");
			},
			n: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "names" ? closeModal() : openModal("names");
			},
			c: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "boardConfig" ? closeModal() : openModal("boardConfig");
			},
			s: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "soundConfig" ? closeModal() : openModal("soundConfig");
			},
			q: () => {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "shortcut" ? closeModal() : openModal("shortcut");
			},
		},
		false,
	);

	const makeMoveHandler = (boardIndex: number, cellIndex: number) => {
		setShowPreview(false);
		if (!hasMoveHappened) {
			setHasMoveHappened(true);
		}
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

		// Log the move
		setMoveLog((prev) => [
			...prev,
			{ player: currentPlayer, board: boardIndex, cell: cellIndex },
		]);

		if (newBoards.every((board) => isBoardDead(board, boardSize))) {
			const loser = currentPlayer;
			const winnerNum = loser === 1 ? 2 : 1;
			const winnerName = winnerNum === 1 ? player1Name : player2Name;
			setWinner(winnerName);
			openModal("winner");
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
		closeModal();
		setHasMoveHappened(false);
		setSelectedBoard(0);
		setMoveLog([]);
		startTimeRef.current = Date.now();
		setElapsed(0);
	};

	const handleBoardConfigChange = (num: BoardNumber, size: BoardSize) => {
		setNumberOfBoards(num);
		setBoardSize(size as BoardSize);
		closeModal();
		resetGame(num, size);
	};

	const p1MoveCount = moveLog.filter((m) => m.player === 1).length;
	const p2MoveCount = moveLog.filter((m) => m.player === 2).length;
	const aliveCount = boards.filter((b) => !isBoardDead(b, boardSize)).length;

	// Build per-board cell ownership maps from moveLog
	const cellOwnersByBoard: Record<number, Record<number, 1 | 2>> = {};
	for (const entry of moveLog) {
		if (!cellOwnersByBoard[entry.board]) {
			cellOwnersByBoard[entry.board] = {};
		}
		cellOwnersByBoard[entry.board][entry.cell] = entry.player;
	}

	const lastMove = moveLog.length > 0 ? moveLog[moveLog.length - 1] : null;

	return (
		<GameLayout>
			<GameTopBar
				player1={{
					name: player1Name,
					moveCount: p1MoveCount,
				}}
				player2={{
					name: player2Name,
					moveCount: p2MoveCount,
				}}
				currentPlayer={currentPlayer}
				boards={boards}
				boardSize={boardSize}
				gameOver={activeModal === "winner"}
				mode="vsPlayer"
			/>

			<GameContentArea>
				<GameLeftPanel>
					<BoardSelector
						boards={boards}
						boardSize={boardSize}
						selectedBoard={selectedBoard}
						onSelectBoard={setSelectedBoard}
					/>
				</GameLeftPanel>

				<GameCenterColumn
					mobileBoardSelector={
						!showPreview ? (
							<BoardSelector
								boards={boards}
								boardSize={boardSize}
								selectedBoard={selectedBoard}
								onSelectBoard={setSelectedBoard}
							/>
						) : undefined
					}>
					<GameStatusBar
						currentPlayer={currentPlayer}
						moveCount={moveLog.length}
						gameOver={activeModal === "winner"}
						mode="vsPlayer"
						player1Name={player1Name}
						player2Name={player2Name}
					/>
					{showPreview ? (
						<BoardPreviewGrid
							boards={boards}
							boardSize={boardSize}
							moveLog={moveLog}
							onSelectBoard={(index) => {
								setSelectedBoard(index);
								setShowPreview(false);
							}}
						/>
					) : (
						<BoardDisplay
							visible={boards.length > 0 && !!boards[selectedBoard]}>
							{boards[selectedBoard] && (
								<Board
									boardIndex={selectedBoard}
									boardState={boards[selectedBoard]}
									makeMove={makeMoveHandler}
									isDead={isBoardDead(boards[selectedBoard], boardSize)}
									boardSize={boardSize}
									cellOwners={cellOwnersByBoard[selectedBoard]}
									lastMoveCell={
										lastMove?.board === selectedBoard
											? lastMove.cell
											: undefined
									}
								/>
							)}
						</BoardDisplay>
					)}
				</GameCenterColumn>

				<GameStatsPanel
					stats={[
						{ label: "TOTAL MOVES", value: moveLog.length },
						{ label: "BOARDS ALIVE", value: aliveCount },
						{ label: "TIME", value: formatTime(elapsed) },
					]}
					moveLog={moveLog}
					boardSize={boardSize}
				/>
			</GameContentArea>

			{/* Action bar */}
			<GameActionBar
				actions={[
					...(boards.length > 1
						? [
								{
									label: showPreview ? "BACK" : "PREVIEW ALL",
									onClick: () => setShowPreview((prev) => !prev),
									variant: "primary" as const,
								},
							]
						: []),
					{
						label: "RESIGN",
						onClick: () => openModal("exitConfirmation"),
						variant: "danger",
					},
				]}
			/>

			{/* Modals */}
			<PlayerNamesModal
				visible={activeModal === "names"}
				onSubmit={(name1: string, name2: string) => {
					setPlayer1Name(name1 || "Player 1");
					setPlayer2Name(name2 || "Player 2");
					closeModal();
					resetGame(numberOfBoards, boardSize);
					setInitialSetupDone(true);
					setGameStarted(true);
				}}
				onClose={initialSetupDone ? closeModal : undefined}
				initialNames={[player1Name, player2Name]}
				key={player1Name + player2Name}
			/>
			<WinnerModal
				visible={activeModal === "winner"}
				winner={winner}
				onPlayAgain={() => {
					closeModal();
					resetGame(numberOfBoards, boardSize);
				}}
				onMenu={() => {
					closeModal();
					router.push("/");
				}}
			/>
			<BoardConfigModal
				visible={activeModal === "boardConfig"}
				currentBoards={numberOfBoards}
				currentSize={boardSize}
				onConfirm={handleBoardConfigChange}
				onCancel={closeModal}
			/>
			<ConfirmationModal
				visible={activeModal === "resetConfirmation"}
				title="Reset Game?"
				message="Are you sure you want to reset the current game?"
				onConfirm={() => {
					resetGame(numberOfBoards, boardSize);
					closeModal();
				}}
				onCancel={closeModal}
				confirmText="Yes, Reset"
			/>
			<ConfirmationModal
				visible={activeModal === "exitConfirmation"}
				title="Exit to Menu?"
				message="Are you sure you want to exit? Your current game will be lost."
				onConfirm={() => {
					router.push("/");
				}}
				onCancel={closeModal}
				confirmText="Yes, Exit"
			/>
		</GameLayout>
	);
};

export default Game;
