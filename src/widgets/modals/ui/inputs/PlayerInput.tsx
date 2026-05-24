import clsx from "clsx";
import type { InputHTMLAttributes } from "react";

export function PlayerInput({
	className,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={clsx(
				"w-full p-3 text-cream text-[9px] font-pixel border-2 border-border-pixel bg-bg0 outline-none focus:border-border-light",
				className,
			)}
			{...props}
		/>
	);
}
