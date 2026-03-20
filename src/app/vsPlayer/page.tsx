"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { create } from "zustand";

const useGlobalModal = create<any>((set) => ({
	activeModal: null,
	openModal: (modal: any) => set({ activeModal: modal }),
	closeModal: () => set({ activeModal: null }),
}));

const useSound = create<any>((set) => ({
	sfxMute: false,
	setSfxMute: (mute: any) => set({ sfxMute: mute }),
}));

let moveAudio: any = null;
let winAudio: any = null;

const Game = () => {
	const [boards, setBoards] = useState<any[]>([]);
	const [boardSize, setBoardSize] = useState<any>(3);
	const [currentPlayer, setCurrentPlayer] = useState<any>(1);
	const [player1Name, setPlayer1Name] = useState<any>("Player 1");
	const [player2Name, setPlayer2Name] = useState<any>("Player 2");
	const [winner, setWinner] = useState<any>("");
	const [numberOfBoards, setNumberOfBoards] = useState<any>(3);
	const [gameStarted, setGameStarted] = useState<any>(false);
	const [initialSetupDone, setInitialSetupDone] = useState<any>(false);
	const [hasMoveHappened, setHasMoveHappened] = useState(false);
	const [selectedBoard, setSelectedBoard] = useState(0);
	const [showPreview, setShowPreview] = useState(false);
	const [moveLog, setMoveLog] = useState<any[]>([]);
	const startTimeRef = useRef<any>(Date.now());
	const [elapsed, setElapsed] = useState(0);

	const { activeModal, openModal, closeModal } = useGlobalModal();
	const { sfxMute } = useSound();
	const router = useRouter();

	useEffect(() => {
		openModal("names");
	}, []);

	useEffect(() => {
		if (!gameStarted) return;
		const interval = setInterval(() => {
			setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
		return () => clearInterval(interval);
	}, [gameStarted]);

	const cooldownTimer = useRef<any>(null);
	const isOnCooldown = useRef(false);

	useEffect(() => {
		const handleKeyDown = (e: any) => {
			const key = e.key.toLowerCase();
			if (activeModal && key !== "escape") return;
			const el = e.target as any;
			const tag = el?.tagName?.toLowerCase();
			if (e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey)
				return;
			if (tag === "input" || tag === "textarea" || el?.isContentEditable)
				return;
			if (key === "escape") {
				if ((!initialSetupDone && !gameStarted) || activeModal === "winner")
					return;
				if (activeModal) return closeModal();
			}
			if (key === "m") {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "exitConfirmation"
					? closeModal()
					: openModal("exitConfirmation");
			}
			if (key === "r") {
				if (!initialSetupDone || !hasMoveHappened || activeModal === "winner")
					return;
				activeModal === "resetConfirmation"
					? closeModal()
					: openModal("resetConfirmation");
			}
			if (key === "n") {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "names" ? closeModal() : openModal("names");
			}
			if (key === "c") {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "boardConfig" ? closeModal() : openModal("boardConfig");
			}
			if (key === "s") {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "soundConfig" ? closeModal() : openModal("soundConfig");
			}
			if (key === "q") {
				if (!initialSetupDone || activeModal === "winner") return;
				activeModal === "shortcut" ? closeModal() : openModal("shortcut");
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeModal, initialSetupDone, gameStarted, hasMoveHappened]);

	const p1MoveCount = moveLog.filter((m: any) => m.player === 1).length;
	const p2MoveCount = moveLog.filter((m: any) => m.player === 2).length;

	const cellOwnersByBoard: any = {};
	for (const entry of moveLog) {
		if (!cellOwnersByBoard[entry.board]) {
			cellOwnersByBoard[entry.board] = {};
		}
		cellOwnersByBoard[entry.board][entry.cell] = entry.player;
	}

	const lastMove = moveLog.length > 0 ? moveLog[moveLog.length - 1] : null;

	const formatTime = (seconds: any) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				backgroundColor: "#0e0e1a",
			}}>
			<div
				style={{
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
				}}>
				<div
					style={{
						fontFamily: '"Press Start 2P", monospace',
						fontSize: "0.5rem",
						color: currentPlayer === 1 ? "#c43c3c" : "#e4d8c0",
						textShadow: currentPlayer === 1 ? "2px 2px 0 #0e0e1a" : "none",
					}}>
					{player1Name}: {p1MoveCount}
				</div>
				<div
					style={{
						fontSize: "0.4rem",
						color: "#6e6e88",
						fontFamily: '"Press Start 2P", monospace',
					}}>
					VS
				</div>
				<div
					style={{
						fontFamily: '"Press Start 2P", monospace',
						fontSize: "0.5rem",
						color: currentPlayer === 2 ? "#c43c3c" : "#e4d8c0",
						textShadow: currentPlayer === 2 ? "2px 2px 0 #0e0e1a" : "none",
					}}>
					{player2Name}: {p2MoveCount}
				</div>
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					padding: "1rem",
					gap: "1rem",
				}}>
				<div
					style={{
						display: "none",
						flexDirection: "column",
						gap: "0.5rem",
						flex: 1,
						maxWidth: "300px",
					}}
					className="md:flex">
					{boards.map((board: any, index: any) => {
						const size = boardSize;
						const isDead = (() => {
							for (let i = 0; i < size; i++) {
								const row = board.slice(i * size, (i + 1) * size);
								const col = Array.from({ length: size }, (_: any, j: any) =>
									board[i + j * size],
								);
								if (row.every((c: any) => c === "X") || col.every((c: any) => c === "X"))
									return true;
							}
							const diag1 = Array.from({ length: size }, (_: any, i: any) =>
								board[i * (size + 1)],
							);
							const diag2 = Array.from(
								{ length: size },
								(_: any, i: any) => board[(i + 1) * (size - 1)],
							);
							return (
								diag1.every((c: any) => c === "X") || diag2.every((c: any) => c === "X")
							);
						})();
						return (
							<div
								key={index}
								style={{
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
								}}
								onClick={() => setSelectedBoard(index)}>
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
									{board.slice(0, boardSize * boardSize).map((cell: any, cellIndex: any) => (
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
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						minWidth: 0,
					}}>
					{!showPreview ? (
						<div
							style={{
								display: "none",
								flexDirection: "column",
								gap: "0.5rem",
								flex: 1,
								maxWidth: "300px",
							}}
							className="md:flex">
							{boards.map((board: any, index: any) => {
								const size = boardSize;
								const isDead = (() => {
									for (let i = 0; i < size; i++) {
										const row = board.slice(i * size, (i + 1) * size);
										const col = Array.from({ length: size }, (_: any, j: any) =>
											board[i + j * size],
										);
										if (
											row.every((c: any) => c === "X") ||
											col.every((c: any) => c === "X")
										)
											return true;
									}
									const diag1 = Array.from({ length: size }, (_: any, i: any) =>
										board[i * (size + 1)],
									);
									const diag2 = Array.from(
										{ length: size },
										(_: any, i: any) => board[(i + 1) * (size - 1)],
									);
									return (
										diag1.every((c: any) => c === "X") ||
										diag2.every((c: any) => c === "X")
									);
								})();
								return (
									<div
										key={index}
										style={{
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
										}}
										onClick={() => setSelectedBoard(index)}>
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
											{board
												.slice(0, boardSize * boardSize)
												.map((cell: any, cellIndex: any) => (
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
					) : null}
					<div
						style={{
							backgroundColor: "#1e1e32",
							border: "3px solid #3a3a56",
							padding: "0.5rem",
							marginBottom: "1rem",
							textAlign: "center",
							fontFamily: '"Press Start 2P", monospace',
							fontSize: "0.4rem",
							color: "#e4d8c0",
						}}>
						{activeModal === "winner"
							? "GAME OVER"
							: `${currentPlayer === 1 ? player1Name : player2Name}'S TURN`} ({moveLog.length} moves)
					</div>
					{showPreview ? (
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
								gap: "1rem",
								width: "100%",
							}}>
							{boards.map((board: any, index: any) => {
								const size = boardSize;
								const isDead = (() => {
									for (let i = 0; i < size; i++) {
										const row = board.slice(i * size, (i + 1) * size);
										const col = Array.from({ length: size }, (_: any, j: any) =>
											board[i + j * size],
										);
										if (
											row.every((c: any) => c === "X") ||
											col.every((c: any) => c === "X")
										)
											return true;
									}
									const diag1 = Array.from({ length: size }, (_: any, i: any) =>
										board[i * (size + 1)],
									);
									const diag2 = Array.from(
										{ length: size },
										(_: any, i: any) => board[(i + 1) * (size - 1)],
									);
									return (
										diag1.every((c: any) => c === "X") ||
										diag2.every((c: any) => c === "X")
									);
								})();
								return (
									<div
										key={index}
										style={{
											border: "3px solid #3a3a56",
											boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
											backgroundColor: "#1e1e32",
											padding: "0.5rem",
											opacity: isDead ? 0.6 : 1,
											cursor: "pointer",
										}}
										onClick={() => {
											setSelectedBoard(index);
											setShowPreview(false);
										}}>
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
											{board
												.slice(0, boardSize * boardSize)
												.map((cell: any, cellIndex: any) => (
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
					) : (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								minHeight: "300px",
							}}>
							{boards.length > 0 && boards[selectedBoard] ? (
								<div
									style={{
										flex: 1,
										padding: "0.5rem",
										maxWidth: "100%",
										opacity: (() => {
											const size = boardSize;
											const board = boards[selectedBoard];
											for (let i = 0; i < size; i++) {
												const row = board.slice(i * size, (i + 1) * size);
												const col = Array.from({ length: size }, (_: any, j: any) =>
													board[i + j * size],
												);
												if (
													row.every((c: any) => c === "X") ||
													col.every((c: any) => c === "X")
												)
													return 0.6;
											}
											const diag1 = Array.from({ length: size }, (_: any, i: any) =>
												board[i * (size + 1)],
											);
											const diag2 = Array.from(
												{ length: size },
												(_: any, i: any) => board[(i + 1) * (size - 1)],
											);
											return diag1.every((c: any) => c === "X") ||
												diag2.every((c: any) => c === "X")
												? 0.6
												: 1;
										})(),
									}}>
									<div
										style={{
											display: "grid",
											gap: "0.25rem",
											width: "100%",
											aspectRatio: "1",
											gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
										}}>
										{[...boards[selectedBoard].entries()].map(([cellIndex, cell]: any) => {
											const isDead = (() => {
												const size = boardSize;
												const board = boards[selectedBoard];
												for (let i = 0; i < size; i++) {
													const row = board.slice(i * size, (i + 1) * size);
													const col = Array.from({ length: size }, (_: any, j: any) =>
														board[i + j * size],
													);
													if (
														row.every((c: any) => c === "X") ||
														col.every((c: any) => c === "X")
													)
														return true;
												}
												const diag1 = Array.from({ length: size }, (_: any, i: any) =>
													board[i * (size + 1)],
												);
												const diag2 = Array.from(
													{ length: size },
													(_: any, i: any) => board[(i + 1) * (size - 1)],
												);
												return (
													diag1.every((c: any) => c === "X") ||
													diag2.every((c: any) => c === "X")
												);
											})();
											const cellOwner = cellOwnersByBoard[selectedBoard]?.[cellIndex];
											const isLastMove =
												lastMove?.board === selectedBoard &&
												lastMove?.cell === cellIndex;
											const baseStyle: any = {
												position: "relative",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												aspectRatio: "1",
												width: "100%",
												border: "1px solid",
												borderColor: "#2c2c44",
												backgroundColor: "#14141e",
												cursor: cell || isDead ? "not-allowed" : "pointer",
											};
											if (isLastMove) {
												baseStyle.borderWidth = "2px";
												if (cellOwner === 2) {
													baseStyle.borderColor = "#facc15";
													baseStyle.boxShadow =
														"inset 0 0 8px rgba(250, 204, 21, 0.4)";
												} else {
													baseStyle.borderColor = "#c43c3c";
													baseStyle.boxShadow =
														"inset 0 0 8px rgba(196, 60, 60, 0.4)";
												}
											}
											if (cell || isDead) {
												baseStyle.backgroundColor = "#2a2a3a";
											}
											return (
												<button
													key={`${selectedBoard}-${cellIndex}-${cell}`}
													type="button"
													onClick={() => {
														setShowPreview(false);
														if (!hasMoveHappened) {
															setHasMoveHappened(true);
														}
														if (
															boards[selectedBoard][cellIndex] !== "" ||
															(() => {
																const size = boardSize;
																const board = boards[selectedBoard];
																for (let i = 0; i < size; i++) {
																	const row = board.slice(i * size, (i + 1) * size);
																	const col = Array.from(
																		{ length: size },
																		(_: any, j: any) => board[i + j * size],
																	);
																	if (
																		row.every((c: any) => c === "X") ||
																		col.every((c: any) => c === "X")
																	)
																		return true;
																}
																const diag1 = Array.from(
																	{ length: size },
																	(_: any, i: any) => board[i * (size + 1)],
																);
																const diag2 = Array.from(
																	{ length: size },
																	(_: any, i: any) => board[(i + 1) * (size - 1)],
																);
																return (
																	diag1.every((c: any) => c === "X") ||
																	diag2.every((c: any) => c === "X")
																);
															})()
														)
															return;
														const newBoards = boards.map((board: any, idx: any) =>
															idx === selectedBoard
																? [
																		...board.slice(0, cellIndex),
																		"X",
																		...board.slice(cellIndex + 1),
																	]
																: [...board],
														);
														if (!sfxMute) {
															if (!moveAudio) {
																moveAudio = new Audio("/sounds/click.mp3");
															}
															moveAudio.currentTime = 0;
															moveAudio.play().catch(console.error);
														}
														setBoards(newBoards);
														setMoveLog((prev: any) => [
															...prev,
															{
																player: currentPlayer,
																board: selectedBoard,
																cell: cellIndex,
															},
														]);
														if (
															newBoards.every((board: any) =>
																(() => {
																	const size = boardSize;
																	for (let i = 0; i < size; i++) {
																		const row = board.slice(i * size, (i + 1) * size);
																		const col = Array.from(
																			{ length: size },
																			(_: any, j: any) => board[i + j * size],
																		);
																		if (
																			row.every((c: any) => c === "X") ||
																			col.every((c: any) => c === "X")
																		)
																			return true;
																	}
																	const diag1 = Array.from(
																		{ length: size },
																		(_: any, i: any) => board[i * (size + 1)],
																	);
																	const diag2 = Array.from(
																		{ length: size },
																		(_: any, i: any) => board[(i + 1) * (size - 1)],
																	);
																	return (
																		diag1.every((c: any) => c === "X") ||
																		diag2.every((c: any) => c === "X")
																	);
																})(),
															)
														) {
															const loser = currentPlayer;
															const winnerNum = loser === 1 ? 2 : 1;
															const winnerName =
																winnerNum === 1 ? player1Name : player2Name;
															setWinner(winnerName);
															openModal("winner");
															if (!sfxMute) {
																if (!winAudio) {
																	winAudio = new Audio("/sounds/wins.mp3");
																}
																winAudio.currentTime = 0;
																winAudio.play().catch(console.error);
															}
															return;
														}
														setCurrentPlayer((prev: any) => (prev === 1 ? 2 : 1));
													}}
													disabled={!!cell || isDead}
													style={baseStyle}>
													{cell ? (
														<div
															style={{
																position: "absolute",
																inset: 0,
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																fontSize: "1.25rem",
																lineHeight: 1,
																fontFamily: '"Press Start 2P", monospace',
																color:
																	cellOwner === 2
																		? "#facc15"
																		: "#c43c3c",
																textShadow:
																	cellOwner === 2
																		? "0 0 4px rgba(250, 204, 21, 0.6)"
																		: "0 0 4px rgba(196, 60, 60, 0.6)",
															}}>
															{cell}
														</div>
													) : null}
												</button>
											);
										})}
									</div>
								</div>
							) : null}
						</div>
					)}
				</div>
				<div
					style={{
						display: "none",
						flexDirection: "column",
						gap: "0.5rem",
						flex: 1,
						maxWidth: "300px",
					}}
					className="md:flex">
					{[
						{ label: "TOTAL MOVES", value: moveLog.length },
						{ label: "BOARDS ALIVE", value: boards.filter((b: any) => !(() => {
															const size = boardSize;
															for (let i = 0; i < size; i++) {
																const row = b.slice(i * size, (i + 1) * size);
																const col = Array.from({ length: size }, (_: any, j: any) =>
																	b[i + j * size],
																);
																if (
																	row.every((c: any) => c === "X") ||
																	col.every((c: any) => c === "X")
																)
																	return true;
															}
															const diag1 = Array.from({ length: size }, (_: any, i: any) =>
																b[i * (size + 1)],
															);
															const diag2 = Array.from(
																{ length: size },
																(_: any, i: any) => b[(i + 1) * (size - 1)],
															);
															return (
																diag1.every((c: any) => c === "X") ||
																diag2.every((c: any) => c === "X")
															);
														})()).length },
						{ label: "TIME", value: formatTime(elapsed) },
					].map((stat: any) => (
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
			</div>
			<div
				style={{
					display: "flex",
					gap: "0.5rem",
					padding: "1rem",
					backgroundColor: "#0e0e1a",
				}}>
				{boards.length > 1 ? (
					<button
						type="button"
						onClick={() => setShowPreview((prev: any) => !prev)}
						style={{
							flex: 1,
							padding: "0.5rem",
							fontFamily: '"Press Start 2P", monospace',
							fontSize: "0.35rem",
							color: "#e4d8c0",
							textTransform: "uppercase",
							letterSpacing: "0.05em",
							border: "3px solid #4e4e6a",
							boxShadow: "3px 3px 0 #0e0e1a",
							cursor: "pointer",
							backgroundColor: "#c43c3c",
						}}>
						{showPreview ? "BACK" : "PREVIEW ALL"}
					</button>
				) : null}
				<button
					type="button"
					onClick={() => openModal("exitConfirmation")}
					style={{
						flex: 1,
						padding: "0.5rem",
						fontFamily: '"Press Start 2P", monospace',
						fontSize: "0.35rem",
						color: "#e4d8c0",
						textTransform: "uppercase",
						letterSpacing: "0.05em",
						border: "3px solid #4e4e6a",
						boxShadow: "3px 3px 0 #0e0e1a",
						cursor: "pointer",
						backgroundColor: "#c43c3c",
					}}>
					RESIGN
				</button>
			</div>
			{activeModal === "names" ? (
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
					<div
						style={{
							backgroundColor: "#1e1e32",
							border: "3px solid #3a3a56",
							boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
							padding: "1rem 1.5rem",
							width: "95%",
							maxWidth: "400px",
							textAlign: "center",
						}}>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.4rem",
								color: "#c43c3c",
								textTransform: "uppercase",
								letterSpacing: "0.1em",
								marginBottom: "1rem",
							}}>
							Enter Player Names
						</div>
						{(() => {
							const [player1, setPlayer1] = useState(
								player1Name || "Player 1",
							);
							const [player2, setPlayer2] = useState(
								player2Name || "Player 2",
							);
							return (
								<>
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
												onChange={(e: any) => setPlayer1(e.target.value)}
												placeholder="Player 1 Name"
												maxLength={15}
												style={{
													width: "100%",
													padding: "0.5rem",
													fontFamily: '"Press Start 2P", monospace',
													fontSize: "0.35rem",
													color: "#e4d8c0",
													backgroundColor: "#0e0e1a",
													border: "3px solid #3a3a56",
													boxShadow: "inset 0 0 0 1px #0e0e1a",
												}}
											/>
											<div
												style={{
													fontSize: "0.3rem",
													color: "#a89878",
													fontFamily: '"Press Start 2P", monospace',
													marginTop: "0.25rem",
													textAlign: "right",
												}}>
												{player1.length}/15
											</div>
										</div>
										<div>
											<input
												type="text"
												value={player2}
												onChange={(e: any) => setPlayer2(e.target.value)}
												placeholder="Player 2 Name"
												maxLength={15}
												style={{
													width: "100%",
													padding: "0.5rem",
													fontFamily: '"Press Start 2P", monospace',
													fontSize: "0.35rem",
													color: "#e4d8c0",
													backgroundColor: "#0e0e1a",
													border: "3px solid #3a3a56",
													boxShadow: "inset 0 0 0 1px #0e0e1a",
												}}
											/>
											<div
												style={{
													fontSize: "0.3rem",
													color: "#a89878",
													fontFamily: '"Press Start 2P", monospace',
													marginTop: "0.25rem",
													textAlign: "right",
												}}>
												{player2.length}/15
											</div>
										</div>
									</div>
									<div
										style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
										<button
											type="button"
											onClick={() => {
												if (isOnCooldown.current) return;
												if (player1.trim().toLowerCase() === player2.trim().toLowerCase()) {
													toast(
														"Player 1 and Player 2 cannot have the same name.",
														{
															toastId: "player-names/duplicate",
															autoClose: 4000,
															onClose: () => {
																if (cooldownTimer.current) {
																	clearTimeout(cooldownTimer.current);
																}
																cooldownTimer.current = null;
																isOnCooldown.current = false;
															},
														},
													);
													isOnCooldown.current = true;
													if (cooldownTimer.current) {
														clearTimeout(cooldownTimer.current);
													}
													cooldownTimer.current = setTimeout(() => {
														isOnCooldown.current = false;
														cooldownTimer.current = null;
													}, 4000);
													return;
												}
												toast.dismiss("player-names/duplicate");
												if (cooldownTimer.current) {
													clearTimeout(cooldownTimer.current);
												}
												cooldownTimer.current = null;
												isOnCooldown.current = false;
												setPlayer1Name(player1 || "Player 1");
												setPlayer2Name(player2 || "Player 2");
												closeModal();
												const initialBoards = Array(numberOfBoards)
													.fill(null)
													.map(() => Array(boardSize * boardSize).fill(""));
												setBoards(initialBoards);
												setCurrentPlayer(1);
												setHasMoveHappened(false);
												setSelectedBoard(0);
												setMoveLog([]);
												startTimeRef.current = Date.now();
												setElapsed(0);
												setInitialSetupDone(true);
												setGameStarted(true);
											}}
											style={{
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
											}}>
											Start Game
										</button>
										{initialSetupDone ? (
											<button
												type="button"
												onClick={closeModal}
												style={{
													backgroundColor: "#222238",
													color: "#e4d8c0",
													padding: "0.75rem",
													fontFamily: '"Press Start 2P", monospace',
													fontSize: "0.4rem",
													textTransform: "uppercase",
													letterSpacing: "0.1em",
													border: "3px solid #3a3a56",
													boxShadow: "3px 3px 0 #0e0e1a",
													cursor: "pointer",
													width: "100%",
												}}>
												Cancel
											</button>
										) : null}
									</div>
								</>
							);
						})()}
					</div>
				</div>
			) : null}
			{activeModal === "winner" ? (
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
					<div
						style={{
							backgroundColor: "#1e1e32",
							border: "3px solid #3a3a56",
							boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
							padding: "1rem 1.5rem",
							width: "95%",
							maxWidth: "400px",
							textAlign: "center",
						}}>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.5rem",
								color: "#c43c3c",
								textTransform: "uppercase",
								letterSpacing: "0.1em",
								marginBottom: "1rem",
							}}>
							Game Over!
						</div>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.4rem",
								color: "#e4d8c0",
								marginBottom: "1.5rem",
							}}>
							{winner === "You" ? "You won!" : `${winner} wins`}
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								gap: "1rem",
							}}>
							<button
								type="button"
								onClick={() => {
									closeModal();
									const initialBoards = Array(numberOfBoards)
										.fill(null)
										.map(() => Array(boardSize * boardSize).fill(""));
									setBoards(initialBoards);
									setCurrentPlayer(1);
									setHasMoveHappened(false);
									setSelectedBoard(0);
									setMoveLog([]);
									startTimeRef.current = Date.now();
									setElapsed(0);
								}}
								style={{
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
								}}>
								Play Again
							</button>
							<button
								type="button"
								onClick={() => {
									closeModal();
									router.push("/");
								}}
								style={{
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
								}}>
								Main Menu
							</button>
						</div>
					</div>
				</div>
			) : null}
			{activeModal === "boardConfig" ? (
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
					<div
						style={{
							backgroundColor: "#1e1e32",
							border: "3px solid #3a3a56",
							boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
							padding: "1rem 1.5rem",
							width: "95%",
							maxWidth: "500px",
							textAlign: "center",
						}}>
						{(() => {
							const [selectedBoards, setSelectedBoards] = useState(numberOfBoards);
							const [selectedSize, setSelectedSize] = useState(boardSize);
							return (
								<>
									<div
										style={{
											fontFamily: '"Press Start 2P", monospace',
											fontSize: "0.4rem",
											color: "#c43c3c",
											textTransform: "uppercase",
											letterSpacing: "0.1em",
											marginBottom: "1rem",
										}}>
										Number of Boards
									</div>
									<div
										style={{
											display: "flex",
											flexWrap: "wrap",
											gap: "0.5rem",
											justifyContent: "center",
											marginBottom: "1.5rem",
										}}>
										{[1, 2, 3, 4, 5].map((num: any) => (
											<button
												type="button"
												key={num}
												onClick={() => setSelectedBoards(num)}
												style={{
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
													backgroundColor:
														selectedBoards === num ? "#c43c3c" : "#222238",
													borderColor:
														selectedBoards === num ? "#c43c3c" : "#3a3a56",
												}}>
												{num}
											</button>
										))}
									</div>
									<div
										style={{
											fontFamily: '"Press Start 2P", monospace',
											fontSize: "0.4rem",
											color: "#c43c3c",
											textTransform: "uppercase",
											letterSpacing: "0.1em",
											marginBottom: "1rem",
										}}>
										Board Size
									</div>
									<div
										style={{
											display: "flex",
											flexWrap: "wrap",
											gap: "0.5rem",
											justifyContent: "center",
											marginBottom: "1.5rem",
										}}>
										{[2, 3, 4, 5].map((size: any) => (
											<button
												type="button"
												key={size}
												onClick={() => setSelectedSize(size)}
												style={{
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
													backgroundColor:
														selectedSize === size ? "#c43c3c" : "#222238",
													borderColor:
														selectedSize === size ? "#c43c3c" : "#3a3a56",
												}}>
												{size}x{size}
											</button>
										))}
									</div>
									<div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
										<button
											type="button"
											onClick={closeModal}
											style={{
												minWidth: "60px",
												padding: "0.5rem 1rem",
												fontFamily: '"Press Start 2P", monospace',
												fontSize: "0.35rem",
												color: "#e4d8c0",
												textTransform: "uppercase",
												letterSpacing: "0.1em",
												border: "3px solid #3a3a56",
												boxShadow: "3px 3px 0 #0e0e1a",
												cursor: "pointer",
												backgroundColor: "#222238",
												flex: 1,
											}}>
											Cancel
										</button>
										<button
											type="button"
											onClick={() => {
												setNumberOfBoards(selectedBoards);
												setBoardSize(selectedSize);
												closeModal();
												const initialBoards = Array(selectedBoards)
													.fill(null)
													.map(() => Array(selectedSize * selectedSize).fill(""));
												setBoards(initialBoards);
												setCurrentPlayer(1);
												setHasMoveHappened(false);
												setSelectedBoard(0);
												setMoveLog([]);
												startTimeRef.current = Date.now();
												setElapsed(0);
											}}
											style={{
												minWidth: "60px",
												padding: "0.5rem 1rem",
												fontFamily: '"Press Start 2P", monospace',
												fontSize: "0.35rem",
												color: "#e4d8c0",
												textTransform: "uppercase",
												letterSpacing: "0.1em",
												border: "3px solid #c43c3c",
												boxShadow: "3px 3px 0 #0e0e1a",
												cursor: "pointer",
												backgroundColor: "#c43c3c",
												flex: 1,
											}}>
											Apply
										</button>
									</div>
								</>
							);
						})()}
					</div>
				</div>
			) : null}
			{activeModal === "resetConfirmation" ? (
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
					<div
						style={{
							backgroundColor: "#1e1e32",
							border: "3px solid #3a3a56",
							boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
							padding: "1rem 1.5rem",
							width: "95%",
							maxWidth: "400px",
							textAlign: "center",
						}}>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.4rem",
								color: "#c43c3c",
								textTransform: "uppercase",
								letterSpacing: "0.1em",
								marginBottom: "0.5rem",
							}}>
							Reset Game?
						</div>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.35rem",
								color: "#e4d8c0",
								margin: "1.5rem 0",
							}}>
							Are you sure you want to reset the current game?
						</div>
						<div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
							<button
								type="button"
								onClick={() => {
									const initialBoards = Array(numberOfBoards)
										.fill(null)
										.map(() => Array(boardSize * boardSize).fill(""));
									setBoards(initialBoards);
									setCurrentPlayer(1);
									closeModal();
									setHasMoveHappened(false);
									setSelectedBoard(0);
									setMoveLog([]);
									startTimeRef.current = Date.now();
									setElapsed(0);
								}}
								style={{
									padding: "0.5rem 2rem",
									fontFamily: '"Press Start 2P", monospace',
									fontSize: "0.35rem",
									color: "#e4d8c0",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
									border: "3px solid #4e4e6a",
									boxShadow: "3px 3px 0 #0e0e1a",
									cursor: "pointer",
									flex: 1,
									backgroundColor: "#c43c3c",
								}}>
								Yes, Reset
							</button>
							<button
								type="button"
								onClick={closeModal}
								style={{
									padding: "0.5rem 2rem",
									fontFamily: '"Press Start 2P", monospace',
									fontSize: "0.35rem",
									color: "#e4d8c0",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
									border: "3px solid #3a3a56",
									boxShadow: "3px 3px 0 #0e0e1a",
									cursor: "pointer",
									flex: 1,
									backgroundColor: "#222238",
								}}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			) : null}
			{activeModal === "exitConfirmation" ? (
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
					<div
						style={{
							backgroundColor: "#1e1e32",
							border: "3px solid #3a3a56",
							boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a",
							padding: "1rem 1.5rem",
							width: "95%",
							maxWidth: "400px",
							textAlign: "center",
						}}>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.4rem",
								color: "#c43c3c",
								textTransform: "uppercase",
								letterSpacing: "0.1em",
								marginBottom: "0.5rem",
							}}>
							Exit to Menu?
						</div>
						<div
							style={{
								fontFamily: '"Press Start 2P", monospace',
								fontSize: "0.35rem",
								color: "#e4d8c0",
								margin: "1.5rem 0",
							}}>
							Are you sure you want to exit? Your current game will be lost.
						</div>
						<div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
							<button
								type="button"
								onClick={() => {
									router.push("/");
								}}
								style={{
									padding: "0.5rem 2rem",
									fontFamily: '"Press Start 2P", monospace',
									fontSize: "0.35rem",
									color: "#e4d8c0",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
									border: "3px solid #4e4e6a",
									boxShadow: "3px 3px 0 #0e0e1a",
									cursor: "pointer",
									flex: 1,
									backgroundColor: "#c43c3c",
								}}>
								Yes, Exit
							</button>
							<button
								type="button"
								onClick={closeModal}
								style={{
									padding: "0.5rem 2rem",
									fontFamily: '"Press Start 2P", monospace',
									fontSize: "0.35rem",
									color: "#e4d8c0",
									textTransform: "uppercase",
									letterSpacing: "0.1em",
									border: "3px solid #3a3a56",
									boxShadow: "3px 3px 0 #0e0e1a",
									cursor: "pointer",
									flex: 1,
									backgroundColor: "#222238",
								}}>
								Cancel
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default Game;