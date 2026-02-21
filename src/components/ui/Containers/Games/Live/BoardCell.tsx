import type { BoardCellProps } from "@/services/types";

const BoardCell = ({ value, onClick, disabled }: BoardCellProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className="w-1/3 h-1/3 border border-bg3 flex items-center justify-center bg-board-bg cursor-pointer">
		<span className="text-2xl text-x font-pixel">{value}</span>
	</button>
);

export default BoardCell;
