import type { ButtonHTMLAttributes } from "react";

export function ProfileButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className="bg-rose-700 text-stone-300 text-[9px]  uppercase tracking-wider px-6 py-2 text-center w-full border-3 border-zinc-600 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer hover:bg-rose-600"
		/>
	);
}
