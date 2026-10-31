import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface CellButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	isLastMove?: boolean;
	owner?: 1 | 2;
}

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
				disabled
					? "bg-gray-800"
					: "bg-slate-950 hover:bg-slate-900 cursor-pointer",
				isLastMove
					? owner === 2
						? "border-2 border-yellow-400 shadow-[inset_0_0_8px_rgba(250,204,21,0.4)]"
						: "border-2 border-rose-600 shadow-[inset_0_0_8px_rgba(196,60,60,0.4)]"
					: "border border-slate-800",
			)}>
			{children}
		</button>
	);
}
