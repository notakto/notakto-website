import clsx from "clsx";
import type { SettingButtonProps } from "@/services/types";

export function SettingButton({
	className,
	disabled = false,
	loading = false,
	children,
	...props
}: SettingButtonProps) {
	return (
		<button
			disabled={disabled || loading}
			className={clsx(
				"w-full sm:w-[45%] py-3 text-cream text-[10px] font-pixel uppercase tracking-wider transition-colors border-3 shadow-[3px_3px_0_var(--color-bg0)]",
				disabled || loading
					? "bg-dead border-dead-border text-muted cursor-not-allowed shadow-none"
					: "bg-primary hover:bg-primary-hover border-border-light cursor-pointer",
				loading && "flex justify-center items-center gap-2",
				className,
			)}
			{...props}>
			{loading && (
				<span className="animate-spin h-4 w-4 border-2 border-cream border-t-transparent" />
			)}
			{loading ? "Processing..." : children}
		</button>
	);
}
