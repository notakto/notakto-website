import type { ButtonHTMLAttributes } from "react";

export function SoundMuteButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className="bg-rose-700 hover:bg-rose-600 text-stone-300 px-3 py-2 w-auto min-w-16.75 text-[8px]  uppercase border-3 border-zinc-600 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer"
		/>
	);
}
