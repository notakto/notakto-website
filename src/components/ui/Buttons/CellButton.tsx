import clsx from "clsx";
import type { ReactNode } from "react";

interface CellButtonProps {
	children: ReactNode;
	onClick: () => void;
	disabled: boolean;
}

export default function CellButton({
	children,
	onClick,
	disabled,
}: CellButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={clsx(
				"relative border border-gray-300 flex items-center justify-center aspect-square",
				disabled ? "bg-gray-800" : "bg-black hover:bg-gray-900",
			)}>
			{children}
		</button>
	);
}
