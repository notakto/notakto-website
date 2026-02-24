import clsx from "clsx";
import type { BoardConfigButtonProps } from "@/services/types";
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
				"min-w-[60px] px-4 py-2 text-cream text-[9px] font-pixel uppercase tracking-wider border-3 shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer",
				isActive
					? "bg-primary border-primary"
					: "bg-bg2 border-border-pixel hover:bg-bg3",
			)}>
			{label}
		</button>
	);
};
