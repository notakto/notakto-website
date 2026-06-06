interface TurnLabelProps {
	currentPlayer: 1 | 2;
	label: string;
}

export default function TurnLabel({ currentPlayer, label }: TurnLabelProps) {
	return (
		<div
			className={`font-pixel text-[16px] sm:text-[20px] md:text-[28px] mt-0.5 md:mt-1 animate-pulse-pixel pixel-text-shadow ${
				currentPlayer === 1 ? "text-primary" : "text-accent"
			}`}>
			{currentPlayer === 1 ? "\u25C0 " : ""}
			{label}
			{currentPlayer === 2 ? " \u25B6" : ""}
		</div>
	);
}
