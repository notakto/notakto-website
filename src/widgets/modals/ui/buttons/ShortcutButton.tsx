import type { ButtonHTMLAttributes } from "react";

export function ShortcutButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className="bg-primary hover:bg-primary-hover text-cream px-8 py-2 text-[9px] font-pixel uppercase tracking-wider w-full mt-4 border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer"
		/>
	);
}
