import type { BadgeProps, BadgeVariant } from "@/services/types";

const variantStyles: Record<BadgeVariant, string> = {
	accent: "bg-accent text-bg0",
	primary: "bg-primary text-cream",
	success: "bg-success text-cream",
};

export default function Badge({
	children,
	variant = "accent",
	className = "",
}: BadgeProps) {
	return (
		<span
			className={`font-pixel text-[7px] px-2 py-0.5 border-2 border-bg0 uppercase ${variantStyles[variant]} ${className}`}>
			{children}
		</span>
	);
}
