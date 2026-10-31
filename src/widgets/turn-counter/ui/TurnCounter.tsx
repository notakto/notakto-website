interface TurnCounterProps {
	moveCount: number;
}

export default function TurnCounter({ moveCount }: TurnCounterProps) {
	return (
		<div className=" text-[10px] sm:text-[11px] md:text-[12px] text-gray-500 uppercase tracking-wider">
			TURN {moveCount + 1}
		</div>
	);
}
