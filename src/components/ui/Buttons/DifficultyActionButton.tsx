import clsx from "clsx";
import type { DifficultyActionProps } from "@/services/types";

export function DifficultyActionButton({
	variant = "level",
	children,
	...props
}: DifficultyActionProps) {
	return (
		<button
			className={clsx(
				"w-full py-2 text-[10px] font-pixel uppercase tracking-wider transition text-cream border-3 shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer",
				variant === "level" &&
					"bg-primary hover:bg-primary-hover border-border-light my-2",
				variant === "cancel" && "bg-bg2 hover:bg-bg3 border-border-pixel mt-4",
			)}
			{...props}>
			{children}
		</button>
	);
}
