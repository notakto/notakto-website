"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import ExitBar from "@/components/ui/Buttons/ExitBar";
import BoardCell from "@/components/ui/Containers/Games/Live/BoardCell";
import BoardGridContainer from "@/components/ui/Containers/Games/Live/BoardGridContainer";
import BoardLiveContainer from "@/components/ui/Containers/Games/Live/BoardLiveContainer";
import LiveContainer from "@/components/ui/Containers/Games/Live/LiveContainer";
import SearchContainer from "@/components/ui/Containers/Games/Live/SearchContainer";
import Spinner from "@/components/ui/Feedback/Spinner";
import GameLayout from "@/components/ui/Layout/GameLayout";
import PlayerTurnTitle from "@/components/ui/Title/PlayerTurnTitle";
import SearchLabel from "@/components/ui/Title/SearchLabel";
import { TOAST_DURATION, TOAST_IDS } from "@/constants/toast";

const SERVER_URL = "https://notakto-websocket.onrender.com";
const socket = io(SERVER_URL);

const LiveMode = () => {
	const router = useRouter();
	const { resetCooldown } = useToastCooldown(TOAST_DURATION);
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

	return (
		<GameLayout>
			<LiveContainer>
				{gameState === "playing" ? (
					<>
						<PlayerTurnTitle
							variant={"live"}
							text={isMyTurn ? "Your Turn" : "Opponent's Turn"}
						/>
						<BoardGridContainer>
							{boards.map((board, boardIndex) => {
								const boardKey = `board-${roomId}-${board.grid.join("")}-${board.blocked}`;
								return (
									<BoardLiveContainer key={boardKey} blocked={board.blocked}>
										{board.grid.map((cell, cellIndex) => (
											<BoardCell
												key={`cell-${cellIndex}-${cell}`} //FIXME: better key
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
	);
};

export default LiveMode;
