import type { MouseEventHandler } from "react";

interface BoardCellProps {
	value: string;
	onClick: MouseEventHandler<HTMLButtonElement>;
	disabled: boolean;
}

const BoardCell = ({ value, onClick, disabled }: BoardCellProps) => (
	<button
		type="button"
		onClick={onClick}
		disabled={disabled}
		className="w-1/3 h-1/3 border border-slate-800 flex items-center justify-center bg-slate-950 cursor-pointer">
		<span className="text-2xl text-rose-700 ">{value}</span>
	</button>
);

export default BoardCell;
