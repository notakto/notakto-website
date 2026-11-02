import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export function PlayerInput({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={clsx(
				"w-full p-3 text-stone-300 text-[9px]  border-2 border-gray-700 bg-slate-950 outline-none focus:border-zinc-600",
				className,
			)}
			{...props}
		/>
	);
}
