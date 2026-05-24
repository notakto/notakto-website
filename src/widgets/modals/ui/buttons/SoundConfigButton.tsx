import type { ButtonHTMLAttributes } from "react";

export function SoundConfigButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className="bg-primary hover:bg-primary-hover text-cream py-2 text-[9px] font-pixel uppercase tracking-wider flex-1 border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer"
			{...props}
		/>
	);
}
