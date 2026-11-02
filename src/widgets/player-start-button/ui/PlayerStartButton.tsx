import type { ButtonHTMLAttributes } from "react";

export function PlayerStartButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className="bg-rose-700 text-stone-300 text-[10px]  uppercase tracking-wider w-full py-3 hover:bg-rose-600 border-3 border-zinc-600 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer"
			{...props}
		/>
	);
}
