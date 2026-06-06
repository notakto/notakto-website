interface PlayerMoveCountProps {
	moveCount: number;
	align?: "left" | "right";
}

export default function PlayerMoveCount({
	moveCount,
	align = "left",
}: PlayerMoveCountProps) {
	return (
		<div
			className={`flex items-center gap-2 mt-1 ${
				align === "right" ? "justify-end" : ""
			}`}>
			<span className="font-pixel text-[8px] md:text-[9px] text-cream-dim">
				{moveCount} MOVES
			</span>
		</div>
	);
}
