import type { ButtonHTMLAttributes } from "react";

export function ProfileButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className="bg-primary text-cream text-[9px] font-pixel uppercase tracking-wider px-6 py-2 text-center w-full border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer hover:bg-primary-hover"
		/>
	);
}
