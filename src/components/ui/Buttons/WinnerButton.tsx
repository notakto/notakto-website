import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function WinnerButton({
	className,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={clsx(
				"bg-primary text-cream px-4 py-2 w-full text-[9px] font-pixel uppercase tracking-wider hover:bg-primary-hover border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer",
				className,
			)}
			{...props}
		/>
	);
}
