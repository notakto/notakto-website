"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { create } from "zustand";

const socket = io("https://notakto-websocket.onrender.com");

const useUser = create((set: any) => ({
	user: null,
	authReady: false,
	setUser: (newUser: any) => set({ user: newUser }),
	setAuthReady: (v: boolean) => set({ authReady: v }),
}));

const LiveMode = () => {
	const router = useRouter();
	const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOnCooldown = useRef(false);

	const _canShowToast = useCallback(() => !isOnCooldown.current, []);

	const _triggerToastCooldown = useCallback(() => {
		isOnCooldown.current = true;

		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}
		cooldownTimer.current = setTimeout(() => {
			isOnCooldown.current = false;
			cooldownTimer.current = null;
		}, 4000);
	}, []);

	const resetCooldown = useCallback(() => {
		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}
		cooldownTimer.current = null;
		isOnCooldown.current = false;
	}, []);

	const user = useUser((s: any) => s.user);
	const authReady = useUser((s: any) => s.authReady);

	useEffect(() => {
		if (!authReady) return;
		if (!user) {
			toast("Please sign in!", {
				toastId: "auth/sign-in-error",
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

	const isBoardDead = (board: any, boardSize: number) => {
		const size = boardSize;
		for (let i = 0; i < size; i++) {
			const row = board.slice(i * size, (i + 1) * size);
			const col = Array.from(
				{ length: size },
				(_: any, j: number) => board[i + j * size],
			);
			if (row.every((c: any) => c === "X") || col.every((c: any) => c === "X"))
				return true;
		}
		const diag1 = Array.from(
			{ length: size },
			(_: any, i: number) => board[i * (size + 1)],
		);
		const diag2 = Array.from(
			{ length: size },
			(_: any, i: number) => board[(i + 1) * (size - 1)],
		);
		return (
			diag1.every((c: any) => c === "X") || diag2.every((c: any) => c === "X")
		);
	};

	useEffect(() => {
		socket.connect();
		socket.emit("joinGame");

		socket.on("gameStart", (data: any) => {
			setRoomId(data.roomId);
			setGameState("playing");
			setIsMyTurn(socket.id === data.firstTurn);
		});

		socket.on("updateBoards", (data: any) => {
			setBoards(data.boards);
			setIsMyTurn(socket.id === data.nextTurn);
		});

		socket.on("gameOver", (data: any) => {
			toast(data.loser === socket.id ? "You Lost!" : "You Won!", {
				toastId: "live-match/game-over",
				autoClose: 4000,
				onClose: resetCooldown,
			});
			setBoards(
				Array(3)
					.fill("")
					.map(() => ({ grid: Array(9).fill(""), blocked: false })),
			);
			setGameState("searching");
			socket.emit("joinGame");
		});

		socket.on("opponentDisconnected", () => {
			toast("Opponent Disconnected! Searching for new match...", {
				toastId: "live-match/opponent-disconnected",
				autoClose: 4000,
				onClose: resetCooldown,
			});
			setBoards(
				Array(3)
					.fill("")
					.map(() => ({ grid: Array(9).fill(""), blocked: false })),
			);
			setGameState("searching");
			socket.emit("joinGame");
		});

		return () => {
			socket.disconnect();
		};
	}, [resetCooldown]);

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

	const boardStates = boards.map((b: any) => b.grid as string[]);

	const aliveCount = boardStates.filter((b: any) => !isBoardDead(b, 3)).length;

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
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					height: "calc(100dvh - 56px)",
					backgroundColor: "#0d0d0d",
					position: "relative",
					overflowY: "auto",
				}}>
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
					{gameState === "playing" ? (
						<>
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
										borderColor: isMyTurn ? "#4a9eff" : "#8b4513",
										flex: 1,
										minWidth: 0,
										transition: "border-color 0.3s",
									}}>
									{isMyTurn && (
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
											You
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
												0 MOVES
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
										{[...boardStates.entries()].map(([i, board]: any) => {
											const dead = isBoardDead(board, 3);
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
										borderColor: !isMyTurn ? "#4a9eff" : "#8b4513",
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
											Opponent
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
												0 MOVES
											</span>
										</div>
									</div>
									{!isMyTurn && (
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

							<div
								style={{
									textAlign: "center",
									padding: "8px 12px",
									flexShrink: 0,
								}}>
								<div
									style={{
										fontFamily: "monospace",
										fontSize: "10px",
										color: "#888",
										textTransform: "uppercase",
										letterSpacing: "0.1em",
									}}>
									TURN 1
								</div>
								<div
									style={{
										fontFamily: "monospace",
										fontSize: "16px",
										marginTop: "2px",
										animation: "pulse 1.5s ease-in-out infinite",
										textShadow: "2px 2px 0 #000",
										color: isMyTurn ? "#4a9eff" : "#ff6b6b",
									}}>
									{isMyTurn ? "◀ " : ""}
									{isMyTurn ? "YOUR TURN" : "OPPONENT TURN"}
									{!isMyTurn ? " ▶" : ""}
								</div>
							</div>

							<div
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(1, 1fr)",
									gap: "24px",
									paddingBottom: "40px",
									width: "100%",
								}}>
								{boards.map((board: any, boardIndex: number) => {
									const boardKey = `board-${roomId}-${board.grid.join("")}-${board.blocked}`;
									return (
										<div
											key={boardKey}
											style={{
												width: "100%",
												maxWidth: "300px",
												aspectRatio: "1",
												display: "flex",
												flexWrap: "wrap",
												backgroundColor: "#1a1a1a",
												border: "3px solid #8b4513",
												opacity: board.blocked ? 0.5 : 1,
											}}>
											{[...board.grid.entries()].map(
												([cellIndex, cell]: any) => (
													<button
														key={`cell-${cellIndex}-${cell}`}
														type="button"
														onClick={() => handleMove(boardIndex, cellIndex)}
														disabled={!isMyTurn || board.blocked || cell !== ""}
														style={{
															width: "33.333%",
															height: "33.333%",
															border: "1px solid #2d2d2d",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															backgroundColor: "#1a1a1a",
															cursor:
																!isMyTurn || board.blocked || cell !== ""
																	? "not-allowed"
																	: "pointer",
															padding: 0,
														}}>
														<span
															style={{
																fontSize: "24px",
																color: "#ff6b6b",
																fontFamily: "monospace",
															}}>
															{cell}
														</span>
													</button>
												),
											)}
										</div>
									);
								})}
							</div>
						</>
					) : (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								gap: "20px",
							}}>
							<div
								style={{
									width: "48px",
									height: "48px",
									border: "4px solid #4a9eff",
									borderTopColor: "transparent",
									animation: "spin 1s linear infinite",
								}}
							/>
							<p
								style={{
									color: "#f5f5dc",
									fontFamily: "monospace",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
									fontSize: "10px",
								}}>
								Searching for opponent...
							</p>
						</div>
					)}
				</div>
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
						onClick={onClose}
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
						Leave
					</button>
				</div>
			</div>
		</>
	);
};

export default LiveMode;
