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
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        {gameState === "playing" ? (
          <>
            <h1 className="text-5xl text-red-600 mb-6">
              {isMyTurn ? "Your Turn" : "Opponent's Turn"}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
              {boards.map((board, boardIndex) => (
                <div
                  key={boardIndex}
                  className={clsx(
                    "w-[300px] h-[300px] flex flex-wrap bg-black",
                    board.blocked && "opacity-50"
                  )}
                >
                  {board.grid.map((cell, cellIndex) => (
                    <button
                      key={cellIndex}
                      onClick={() => handleMove(boardIndex, cellIndex)}
                      disabled={!isMyTurn || board.blocked || cell !== ""}
                      className="w-1/3 h-1/3 border border-gray-300 flex items-center justify-center bg-black"
                      aria-label={`Board ${boardIndex + 1} cell ${cellIndex + 1} ${cell ? `occupied by ${cell}` : 'empty'}`}
                    >
                      <span className="text-[100px] text-red-600">{cell}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-5">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-2xl">Searching for opponent...</p>
          </div>
        )}
      </div>
      <div className="w-full bg-red-600 py-3 text-center mt-auto">
        <button onClick={onClose} className="text-white text-2xl">
          Leave
        </button>
      </div>
    </div>
  );
};

export default LiveMode;
