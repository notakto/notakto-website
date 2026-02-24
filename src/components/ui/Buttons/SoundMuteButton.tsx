import type { ButtonHTMLAttributes } from "react";

export function SoundMuteButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className="bg-primary hover:bg-primary-hover text-cream px-3 py-2 w-auto min-w-[67px] text-[8px] font-pixel uppercase border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer"
		/>
	);
}
