import GameOverText from "@/widgets/game-over-text/ui/GameOverText";
import TurnCounter from "@/widgets/turn-counter/ui/TurnCounter";
import TurnLabel from "@/widgets/turn-label/ui/TurnLabel";

interface GameStatusBarProps {
	currentPlayer: 1 | 2;
	moveCount: number;
	gameOver: boolean;
	mode: "vsComputer" | "vsPlayer" | "liveMatch";
	player1Name: string;
	player2Name: string;
}

export default function GameStatusBar({
	currentPlayer,
	moveCount,
	gameOver,
	mode,
	player1Name,
	player2Name,
}: GameStatusBarProps) {
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
		<div className="text-center py-2 px-3 sm:py-3 sm:px-4 md:py-4 md:px-4 shrink-0">
			{gameOver ? (
				<GameOverText />
			) : (
				<>
					<TurnCounter moveCount={moveCount} />
					<TurnLabel currentPlayer={currentPlayer} label={turnLabel} />
				</>
			)}
		</div>
	);
}
