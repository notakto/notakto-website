interface MoveLogPlayerTagProps {
	player: 1 | 2;
}

export default function MoveLogPlayerTag({ player }: MoveLogPlayerTagProps) {
	return (
		<span
			className={`font-pixel text-[8px] w-7 ${
				player === 1 ? "text-primary" : "text-accent"
			}`}>
			{player === 1 ? "P1" : "P2"}
		</span>
	);
}
