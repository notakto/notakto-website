"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useUser } from "@/features/authenticate-user/model/userStore";
import {
	TOAST_DURATION,
	TOAST_IDS,
} from "@/features/show-toast-with-cooldown/model/toast";
import { useToastCooldown } from "@/features/show-toast-with-cooldown/model/useToastCooldown";
import ExitBar from "@/widgets/exit-bar/ui/ExitBar";
import GameLayout from "@/widgets/game-layout/ui/GameLayout";
import LiveContainer from "@/widgets/live-container/ui/LiveContainer";
import LiveMatchPlayingState from "@/widgets/live-match-playing-state/ui/LiveMatchPlayingState";
import LiveMatchSearchState from "@/widgets/live-match-search-state/ui/LiveMatchSearchState";

const SERVER_URL = "https://notakto-websocket.onrender.com";
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
		<GameLayout>
			<LiveContainer>
				{gameState === "playing" ? (
					<LiveMatchPlayingState
						boards={boards}
						boardStates={boardStates}
						roomId={roomId}
						isMyTurn={isMyTurn}
						onMove={handleMove}
					/>
				) : (
					<LiveMatchSearchState />
				)}
			</LiveContainer>
			<ExitBar text={"Leave"} onClick={onClose} />
		</GameLayout>
	);
};

export default LiveMode;
