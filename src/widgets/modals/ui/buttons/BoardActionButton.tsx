import type { ButtonHTMLAttributes } from "react";

export function BoardActionButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className="flex-1 py-2 bg-primary text-cream text-[9px] font-pixel uppercase tracking-wider hover:bg-primary-hover border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer"
			{...props}
		/>
	);
}
