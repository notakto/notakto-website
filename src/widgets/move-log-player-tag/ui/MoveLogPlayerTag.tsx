interface MoveLogPlayerTagProps {
	player: 1 | 2;
}

export default function MoveLogPlayerTag({ player }: MoveLogPlayerTagProps) {
	return (
		<span
			className={` text-[8px] w-7 ${
				player === 1 ? "text-rose-700" : "text-yellow-500"
			}`}>
			{player === 1 ? "P1" : "P2"}
		</span>
	);
}
