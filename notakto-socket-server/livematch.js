import { createServer } from "node:http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: [
			"https://notakto-website.vercel.app",
			"https://paradox-xx.vercel.app",
		],
		methods: ["GET", "POST"],
	},
});

const rooms = new Map();

io.on("connection", (socket) => {
	console.log("Player connected:", socket.id);

	socket.on("joinGame", () => {
		let foundRoom = false;

		for (const [roomId, room] of rooms.entries()) {
			if (room.players.length === 1) {
				room.players.push(socket.id);
				socket.join(roomId);
				room.currentPlayer = room.players[0];

				io.to(roomId).emit("gameStart", {
					roomId,
					firstTurn: room.players[0],
				});

				foundRoom = true;
				console.log(`Room ${roomId} is now full. Starting game.`);
				break;
			}
		}

		if (!foundRoom) {
			const newRoom = {
				players: [socket.id],
				boards: Array(3)
					.fill()
					.map(() => ({
						grid: Array(9).fill(""),
						blocked: false,
					})),
				currentPlayer: null,
			};
			rooms.set(socket.id, newRoom);
			socket.join(socket.id);
			console.log(`Created new room: ${socket.id}`);
		}
	});

	socket.on("makeMove", ({ roomId, boardIndex, cellIndex }) => {
		const room = rooms.get(roomId);
		if (!room) return;

		const board = room.boards[boardIndex];
		if (board.blocked || board.grid[cellIndex] !== "") return;

		board.grid[cellIndex] = "X";
		const isBlocked = checkGameOver(board.grid);
		if (isBlocked) board.blocked = true;

		const allBlocked = room.boards.every((b) => b.blocked);
		room.currentPlayer = room.players.find((p) => p !== socket.id);

		io.to(roomId).emit("updateBoards", {
			boards: room.boards.map((b) => ({
				grid: [...b.grid],
				blocked: b.blocked,
			})),
			nextTurn: room.currentPlayer,
		});

		if (allBlocked) {
			io.to(roomId).emit("gameOver", { loser: socket.id });
			rooms.delete(roomId);
		}
	});

	socket.on("disconnect", () => {
		console.log("Player disconnected:", socket.id);
		for (const [roomId, room] of rooms.entries()) {
			if (room.players.includes(socket.id)) {
				if (room.players.length === 2) {
					const otherPlayer = room.players.find((p) => p !== socket.id);
					io.to(otherPlayer).emit("opponentDisconnected");
				}
				rooms.delete(roomId);
				break;
			}
		}
	});
});

function checkGameOver(grid) {
	const patterns = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8], // Rows
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8], // Columns
		[0, 4, 8],
		[2, 4, 6], // Diagonals
	];
	return patterns.some((p) => p.every((i) => grid[i] === "X"));
}

const PORT = 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
