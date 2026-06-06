interface MoveLogRowNumberProps {
	index: number;
}

export default function MoveLogRowNumber({ index }: MoveLogRowNumberProps) {
	return (
		<span className="font-pixel text-[8px] text-muted w-6 text-right">
			{index + 1}.
		</span>
	);
}
