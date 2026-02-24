import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function MenuButton({
	className,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={clsx(
				"w-full bg-primary py-3 text-cream text-[10px] font-pixel uppercase tracking-wider hover:bg-primary-hover border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer",
				className,
			)}
			{...props}
		/>
	);
}
