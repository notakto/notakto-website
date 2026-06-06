interface BoardsAliveCountProps {
	aliveCount: number;
}

export default function BoardsAliveCount({
	aliveCount,
}: BoardsAliveCountProps) {
	return (
		<div className="font-pixel text-[8px] text-muted mt-1.5">
			{aliveCount} BOARD{aliveCount !== 1 ? "S" : ""} ALIVE
		</div>
	);
}
