import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function WinnerButton({
	className,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={clsx(
				"bg-rose-700 text-stone-300 px-4 py-2 w-full text-[9px]  uppercase tracking-wider hover:bg-rose-600 border-3 border-zinc-600 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer",
				className,
			)}
			{...props}
		/>
	);
}
