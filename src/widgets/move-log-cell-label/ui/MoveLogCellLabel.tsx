interface MoveLogCellLabelProps {
	row: number;
	col: number;
}

export default function MoveLogCellLabel({ row, col }: MoveLogCellLabelProps) {
	return (
		<span className=" text-[7px] text-gray-500">
			[{row},{col}]
		</span>
	);
}
