interface BoardCellProps {
	value: string;
	onClick: () => void;
	disabled: boolean;
}

const BoardCell = ({ value, onClick, disabled }: BoardCellProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className="w-1/3 h-1/3 border border-gray-300 flex items-center justify-center bg-black">
		<span className="text-[100px] text-red-600">{value}</span>
	</button>
);

export default BoardCell;
