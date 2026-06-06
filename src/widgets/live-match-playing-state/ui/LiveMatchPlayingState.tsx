import GameStatusBar from "@/widgets/game-status-bar/ui/GameStatusBar";
import GameTopBar from "@/widgets/game-top-bar/ui/GameTopBar";
import LiveMatchBoardList from "@/widgets/live-match-board-list/ui/LiveMatchBoardList";

interface LiveBoard {
	grid: string[];
	blocked: boolean;
}

interface LiveMatchPlayingStateProps {
	boards: LiveBoard[];
	boardStates: string[][];
	roomId: string;
	isMyTurn: boolean;
	onMove: (boardIndex: number, cellIndex: number) => void;
}

export default function LiveMatchPlayingState({
	boards,
	boardStates,
	roomId,
	isMyTurn,
	onMove,
}: LiveMatchPlayingStateProps) {
	return (
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
			<LiveMatchBoardList
				boards={boards}
				roomId={roomId}
				isMyTurn={isMyTurn}
				onMove={onMove}
			/>
		</>
	);
}
