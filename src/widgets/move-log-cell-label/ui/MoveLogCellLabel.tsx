interface MoveLogCellLabelProps {
	row: number;
	col: number;
}

export default function MoveLogCellLabel({ row, col }: MoveLogCellLabelProps) {
	return (
		<span className="font-pixel text-[7px] text-muted">
			[{row},{col}]
		</span>
	);
}
