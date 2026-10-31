interface BoardsAliveCountProps {
	aliveCount: number;
}

export default function BoardsAliveCount({
	aliveCount,
}: BoardsAliveCountProps) {
	return (
		<div className=" text-[8px] text-gray-500 mt-1.5">
			{aliveCount} BOARD{aliveCount !== 1 ? "S" : ""} ALIVE
		</div>
	);
}
