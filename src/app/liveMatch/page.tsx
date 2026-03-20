"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============= CONSTANTS =============

const TOAST_DURATION = 4000;

const TOAST_IDS = {
	User: {
		SignInError: "auth/sign-in-error",
	},
	PlayerNames: {
		Duplicate: "player-names/duplicate",
	},
	Payment: {
		PopupBlocked: "payment/popup-blocked",
		Success: "payment/success",
		Failure: "payment/failure",
	},
	LiveMatch: {
		OpponentDisconnected: "live-match/opponent-disconnected",
		GameOver: "live-match/game-over",
	},
} as const;

const SERVER_URL = "https://notakto-websocket.onrender.com";

// ============= TYPES =============

type BoardState = Array<string>;

interface UserStore {
	user: any;
	authReady: boolean;
	setUser: (newUser: any) => void;
	setAuthReady: (v: boolean) => void;
}

interface BoardCellProps {
	value: string;
	onClick: React.MouseEventHandler<HTMLButtonElement>;
	disabled: boolean;
}

interface BoardGridContainerProps {
	children?: React.ReactNode;
}

interface BoardLiveContainerProps {
	blocked: boolean;
	children?: React.ReactNode;
}

interface LiveContainerProps {
	children?: React.ReactNode;
}

interface SearchContainerProps {
	children?: React.ReactNode;
}

interface GameLayoutProps {
	children?: React.ReactNode;
}

interface ExitBarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
}

interface PlayerPanel {
	name: string;
	moveCount: number;
}

interface GameTopBarProps {
	player1: PlayerPanel;
	player2: PlayerPanel;
	currentPlayer: 1 | 2;
	boards: BoardState[];
	boardSize: number;
	gameOver: boolean;
	mode: "vsComputer" | "vsPlayer" | "liveMatch";
}

// ============= LOGIC =============

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

// ============= STORE =============

const useUser = create<UserStore>((set) => ({
	user: null,
	authReady: false,
	setUser: (newUser) => set({ user: newUser }),
	setAuthReady: (v: boolean) => set({ authReady: v }),
}));

// ============= HOOKS =============

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

// ============= COMPONENTS =============

// Spinner Component
const Spinner = () => (
	<div
		style={{
			width: "48px",
			height: "48px",
			border: "4px solid #4a9eff",
			borderTopColor: "transparent",
			animation: "spin 1s linear infinite",
		}}
	/>
);

// SearchLabel Component
const SearchLabel = ({ text }: { text: string }) => (
	<p
		style={{
			color: "#f5f5dc",
			fontFamily: "monospace",
			textTransform: "uppercase",
			letterSpacing: "0.1em",
			fontSize: "10px",
		}}>
		{text}
	</p>
);

// ExitBar Component
function ExitBar({ text, ...props }: ExitBarProps) {
	return (
		<div
			style={{
				width: "100%",
				backgroundColor: "#4a9eff",
				padding: "12px 0",
				textAlign: "center",
				marginTop: "auto",
				borderTop: "3px solid #8b4513",
			}}>
			<button
				{...props}
				style={{
					color: "#f5f5dc",
					fontSize: "10px",
					fontFamily: "monospace",
					textTransform: "uppercase",
					letterSpacing: "0.1em",
					cursor: "pointer",
					background: "none",
					border: "none",
					padding: 0,
				}}>
				{text}
			</button>
		</div>
	);
}

// BoardCell Component
const BoardCell = ({ value, onClick, disabled }: BoardCellProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		style={{
			width: "33.333%",
			height: "33.333%",
			border: "1px solid #2d2d2d",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundColor: "#1a1a1a",
			cursor: disabled ? "not-allowed" : "pointer",
			padding: 0,
		}}>
		<span
			style={{
				fontSize: "24px",
				color: "#ff6b6b",
				fontFamily: "monospace",
			}}>
			{value}
		</span>
	</button>
);

// BoardGridContainer Component
function BoardGridContainer({ children }: BoardGridContainerProps) {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "repeat(1, 1fr)",
				gap: "24px",
				paddingBottom: "40px",
				width: "100%",
			}}>
			{children}
		</div>
	);
}

// BoardLiveContainer Component
function BoardLiveContainer({ blocked, children }: BoardLiveContainerProps) {
	return (
		<div
			style={{
				width: "100%",
				maxWidth: "300px",
				aspectRatio: "1",
				display: "flex",
				flexWrap: "wrap",
				backgroundColor: "#1a1a1a",
				border: "3px solid #8b4513",
				opacity: blocked ? 0.5 : 1,
			}}>
			{children}
		</div>
	);
}

// LiveContainer Component
function LiveContainer({ children }: LiveContainerProps) {
	return (
		<div
			style={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: "0 16px",
				overflowY: "auto",
				minHeight: 0,
			}}>
			{children}
		</div>
	);
}

// SearchContainer Component
function SearchContainer({ children }: SearchContainerProps) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: "20px",
			}}>
			{children}
		</div>
	);
}

// GameLayout Component
function GameLayout({ children }: GameLayoutProps) {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				height: "calc(100dvh - 56px)",
				backgroundColor: "#0d0d0d",
				position: "relative",
				overflowY: "auto",
			}}>
			{children}
		</div>
	);
}

// GameTopBar Component
function GameTopBar({
	player1,
	player2,
	currentPlayer,
	boards,
	boardSize,
	gameOver,
}: GameTopBarProps) {
	const aliveCount = boards.filter((b) => !isBoardDead(b, boardSize)).length;

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				gap: "8px",
				padding: "8px 12px",
				flexShrink: 0,
			}}>
			{/* Player 1 panel */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					padding: "10px 12px",
					border: "3px solid",
					borderColor: currentPlayer === 1 && !gameOver ? "#4a9eff" : "#8b4513",
					flex: 1,
					minWidth: 0,
					transition: "border-color 0.3s",
				}}>
				{currentPlayer === 1 && !gameOver && (
					<div
						style={{
							width: "6px",
							alignSelf: "stretch",
							backgroundColor: "#4a9eff",
							flexShrink: 0,
							animation: "pulse 1.5s ease-in-out infinite",
						}}
					/>
				)}
				<div
					style={{
						minWidth: 0,
						flex: 1,
					}}>
					<div
						style={{
							fontFamily: "monospace",
							fontSize: "10px",
							color: "#f5f5dc",
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}>
						{player1.name}
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginTop: "4px",
						}}>
						<span
							style={{
								fontFamily: "monospace",
								fontSize: "8px",
								color: "#cccccc",
							}}>
							{player1.moveCount} MOVES
						</span>
					</div>
				</div>
			</div>

			{/* Center: board dots + alive count */}
			<div
				style={{
					textAlign: "center",
					flexShrink: 0,
				}}>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						gap: "8px",
					}}>
					{[...boards.entries()].map(([i, board]) => {
						const dead = isBoardDead(board, boardSize);
						return (
							<div
								key={`dot-${i}`}
								style={{
									width: "12px",
									height: "12px",
									transition: "all 0.3s",
									backgroundColor: dead ? "#666" : "#4ade80",
									border: "2px solid",
									borderColor: dead ? "#888" : "#22c55e",
								}}
							/>
						);
					})}
				</div>
				<div
					style={{
						fontFamily: "monospace",
						fontSize: "8px",
						color: "#888",
						marginTop: "6px",
					}}>
					{aliveCount} BOARD{aliveCount !== 1 ? "S" : ""} ALIVE
				</div>
			</div>

			{/* Player 2 panel */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "12px",
					padding: "10px 12px",
					border: "3px solid",
					borderColor: currentPlayer === 2 && !gameOver ? "#4a9eff" : "#8b4513",
					flex: 1,
					minWidth: 0,
					transition: "border-color 0.3s",
				}}>
				<div
					style={{
						minWidth: 0,
						flex: 1,
						textAlign: "right",
					}}>
					<div
						style={{
							fontFamily: "monospace",
							fontSize: "10px",
							color: "#f5f5dc",
							textTransform: "uppercase",
							letterSpacing: "0.1em",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						}}>
						{player2.name}
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginTop: "4px",
							justifyContent: "flex-end",
						}}>
						<span
							style={{
								fontFamily: "monospace",
								fontSize: "8px",
								color: "#cccccc",
							}}>
							{player2.moveCount} MOVES
						</span>
					</div>
				</div>
				{currentPlayer === 2 && !gameOver && (
					<div
						style={{
							width: "6px",
							alignSelf: "stretch",
							backgroundColor: "#4a9eff",
							flexShrink: 0,
							animation: "pulse 1.5s ease-in-out infinite",
						}}
					/>
				)}
			</div>
		</div>
	);
}

// GameStatusBar Component
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
	mode: "vsComputer" | "vsPlayer" | "liveMatch";
	player1Name: string;
	player2Name: string;
}) {
	const turnLabel =
		mode === "vsComputer"
			? currentPlayer === 1
				? "YOUR TURN"
				: "CPU TURN"
			: mode === "liveMatch"
				? currentPlayer === 1
					? "YOUR TURN"
					: "OPPONENT TURN"
				: currentPlayer === 1
					? `${player1Name.toUpperCase()}'S TURN`
					: `${player2Name.toUpperCase()}'S TURN`;

	return (
		<div
			style={{
				textAlign: "center",
				padding: "8px 12px",
				flexShrink: 0,
			}}>
			{gameOver ? (
				<div
					style={{
						fontFamily: "monospace",
						fontSize: "20px",
						color: "#4a9eff",
						animation: "pulse 1.5s ease-in-out infinite",
						textShadow: "2px 2px 0 #000",
					}}>
					GAME OVER
				</div>
			) : (
				<>
					<div
						style={{
							fontFamily: "monospace",
							fontSize: "10px",
							color: "#888",
							textTransform: "uppercase",
							letterSpacing: "0.1em",
						}}>
						TURN {moveCount + 1}
					</div>
					<div
						style={{
							fontFamily: "monospace",
							fontSize: "16px",
							marginTop: "2px",
							animation: "pulse 1.5s ease-in-out infinite",
							textShadow: "2px 2px 0 #000",
							color: currentPlayer === 1 ? "#4a9eff" : "#ff6b6b",
						}}>
						{currentPlayer === 1 ? "◀ " : ""}
						{turnLabel}
						{currentPlayer === 2 ? " ▶" : ""}
					</div>
				</>
			)}
		</div>
	);
}

// ============= MAIN PAGE COMPONENT =============

const socket = io(SERVER_URL);

const LiveMode = () => {
	const router = useRouter();
	const { resetCooldown } = useToastCooldown(TOAST_DURATION);
	const user = useUser((s) => s.user);
	const authReady = useUser((s) => s.authReady);

	useEffect(() => {
		if (!authReady) return;
		if (!user) {
			toast("Please sign in!", {
				toastId: TOAST_IDS.User.SignInError,
			});
			router.push("/");
		}
	}, [authReady, user, router]);

	const onClose = () => {
		router.push("/");
	};

	const [boards, setBoards] = useState(
		Array(3)
			.fill("")
			.map(() => ({ grid: Array(9).fill(""), blocked: false })),
	);
	const [isMyTurn, setIsMyTurn] = useState(false);
	const [roomId, setRoomId] = useState("");
	const [gameState, setGameState] = useState<"searching" | "playing">(
		"searching",
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation here>
	useEffect(() => {
		socket.connect();
		socket.emit("joinGame");

		socket.on("gameStart", (data: { roomId: string; firstTurn: string }) => {
			setRoomId(data.roomId);
			setGameState("playing");
			setIsMyTurn(socket.id === data.firstTurn);
		});

		// biome-ignore lint/suspicious/noExplicitAny: <fix later>
		socket.on("updateBoards", (data: { boards: any[]; nextTurn: string }) => {
			setBoards(data.boards);
			setIsMyTurn(socket.id === data.nextTurn);
		});

		socket.on("gameOver", (data: { loser: string }) => {
			toast(data.loser === socket.id ? "You Lost!" : "You Won!", {
				toastId: TOAST_IDS.LiveMatch.GameOver,
				autoClose: TOAST_DURATION,
				onClose: resetCooldown,
			});
			resetGame();
		});

		socket.on("opponentDisconnected", () => {
			toast("Opponent Disconnected! Searching for new match...", {
				toastId: TOAST_IDS.LiveMatch.OpponentDisconnected,
				autoClose: TOAST_DURATION,
				onClose: resetCooldown,
			});
			resetGame();
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleMove = (boardIndex: number, cellIndex: number) => {
		if (
			!isMyTurn ||
			boards[boardIndex].blocked ||
			boards[boardIndex].grid[cellIndex] !== "" ||
			!roomId
		)
			return;
		socket.emit("makeMove", { roomId, boardIndex, cellIndex });
	};

	const resetGame = () => {
		setBoards(
			Array(3)
				.fill("")
				.map(() => ({ grid: Array(9).fill(""), blocked: false })),
		);
		setGameState("searching");
		socket.emit("joinGame");
	};

	// Convert live boards to BoardState[] for GameTopBar
	const boardStates = boards.map((b) => b.grid as string[]);

	return (
		<>
			<style jsx global>{`
				@keyframes spin {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.5;
					}
				}
			`}</style>
			<GameLayout>
				<LiveContainer>
					{gameState === "playing" ? (
						<>
							<GameTopBar
								player1={{ name: "You", moveCount: 0 }}
								player2={{ name: "Opponent", moveCount: 0 }}
								currentPlayer={isMyTurn ? 1 : 2}
								boards={boardStates}
								boardSize={3}
								gameOver={false}
								mode="liveMatch"
							/>
							<GameStatusBar
								currentPlayer={isMyTurn ? 1 : 2}
								moveCount={0}
								gameOver={false}
								mode="liveMatch"
								player1Name="You"
								player2Name="Opponent"
							/>
							<BoardGridContainer>
								{boards.map((board, boardIndex) => {
									const boardKey = `board-${roomId}-${board.grid.join("")}-${board.blocked}`;
									return (
										<BoardLiveContainer key={boardKey} blocked={board.blocked}>
											{[...board.grid.entries()].map(([cellIndex, cell]) => (
												<BoardCell
													key={`cell-${cellIndex}-${cell}`}
													value={cell}
													onClick={() => handleMove(boardIndex, cellIndex)}
													disabled={!isMyTurn || board.blocked || cell !== ""}
												/>
											))}
										</BoardLiveContainer>
									);
								})}
							</BoardGridContainer>
						</>
					) : (
						<SearchContainer>
							<Spinner />
							<SearchLabel text="Searching for opponent..." />
						</SearchContainer>
					)}
				</LiveContainer>
				<ExitBar text={"Leave"} onClick={onClose} />
			</GameLayout>
		</>
	);
};

export default LiveMode;
