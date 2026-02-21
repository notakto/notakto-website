import type { ButtonHTMLAttributes } from "react";

export function PlayerStartButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className="bg-primary text-cream text-[10px] font-pixel uppercase tracking-wider w-full py-3 hover:bg-primary-hover border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer"
			{...props}
		/>
	);
}
