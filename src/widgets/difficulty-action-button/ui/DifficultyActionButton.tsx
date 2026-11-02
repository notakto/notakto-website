import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface DifficultyActionProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	variant?: "level" | "cancel";
}

export function DifficultyActionButton({
	variant = "level",
	children,
	...props
}: DifficultyActionProps) {
	return (
		<button
			className={clsx(
				"w-full py-2 text-[10px]  uppercase tracking-wider transition text-stone-300 border-3 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer",
				variant === "level" &&
					"bg-rose-700 hover:bg-rose-600 border-zinc-600 my-2",
				variant === "cancel" &&
					"bg-slate-800 hover:bg-slate-800 border-gray-700 mt-4",
			)}
			{...props}>
			{children}
		</button>
	);
}
