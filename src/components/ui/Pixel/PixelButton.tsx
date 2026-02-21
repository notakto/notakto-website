import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "accent" | "danger" | "ghost" | "success";
type Size = "sm" | "md" | "lg";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: Variant;
	size?: Size;
	loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
	primary:
		"bg-primary hover:bg-primary-hover border-border-light hover:border-pixel-white text-cream",
	accent:
		"bg-accent hover:bg-accent-dim border-border-light hover:border-pixel-white text-bg0",
	danger:
		"bg-primary hover:bg-primary-hover border-border-light hover:border-pixel-white text-cream",
	ghost:
		"bg-transparent hover:bg-bg2 border-border-pixel hover:border-border-light text-cream",
	success:
		"bg-success hover:bg-success-dim border-border-light hover:border-pixel-white text-cream",
};

const sizeStyles: Record<Size, string> = {
	sm: "px-3 py-1.5 text-[8px]",
	md: "px-5 py-2.5 text-[10px]",
	lg: "px-7 py-3 text-xs",
};

export default function PixelButton({
	children,
	variant = "primary",
	size = "md",
	loading = false,
	disabled,
	className = "",
	...props
}: PixelButtonProps) {
	const isDisabled = disabled || loading;
	return (
		<button
			disabled={isDisabled}
			className={`
				font-pixel uppercase tracking-wider border-3 cursor-pointer
				transition-all duration-100
				${isDisabled ? "bg-dead border-dead-border text-muted cursor-not-allowed shadow-none" : `${variantStyles[variant]} shadow-[3px_3px_0_var(--color-bg0)]`}
				${sizeStyles[size]}
				${className}
			`}
			{...props}>
			{loading ? "..." : children}
		</button>
	);
}
