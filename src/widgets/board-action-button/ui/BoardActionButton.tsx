import type { ButtonHTMLAttributes } from "react";

export function BoardActionButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className="flex-1 py-2 bg-rose-700 text-stone-300 text-[9px]  uppercase tracking-wider hover:bg-rose-600 border-3 border-zinc-600 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer"
			{...props}
		/>
	);
}
