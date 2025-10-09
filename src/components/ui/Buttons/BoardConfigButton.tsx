import clsx from "clsx";
import type { ReactNode } from "react";

interface BoardConfigButtonProps {
	label: ReactNode; // text shown inside
	isActive: boolean; // whether this button is selected
	onClick: () => void; // action when clicked
}
export const BoardConfigButton = ({
	label,
	isActive,
	onClick,
}: BoardConfigButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={clsx(
				"min-w-[60px] px-4 py-2 text-white text-xl",
				isActive ? "bg-red-600" : "bg-blue-600",
			)}>
			{label}
		</button>
	);
};
