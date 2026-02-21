import clsx from "clsx";
import type { CellButtonProps } from "@/services/types";

export default function CellButton({
	children,
	onClick,
	disabled,
	isLastMove,
	owner,
}: CellButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				"relative flex items-center justify-center aspect-square",
				disabled ? "bg-dead" : "bg-board-bg hover:bg-bg1 cursor-pointer",
				isLastMove
					? owner === 2
						? "border-2 border-yellow-400 shadow-[inset_0_0_8px_rgba(250,204,21,0.4)]"
						: "border-2 border-red-500 shadow-[inset_0_0_8px_rgba(196,60,60,0.4)]"
					: "border border-bg3",
			)}>
			{children}
		</button>
	);
}
