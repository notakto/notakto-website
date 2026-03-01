import type { ReactNode } from "react";

type HeadingSize = "xs" | "sm" | "md" | "lg";
type HeadingColor = "cream" | "primary" | "accent" | "muted";

interface HeadingProps {
	children: ReactNode;
	size?: HeadingSize;
	color?: HeadingColor;
	className?: string;
}

const sizeStyles: Record<HeadingSize, string> = {
	xs: "text-[8px]",
	sm: "text-[10px]",
	md: "text-sm",
	lg: "text-base",
};

const colorStyles: Record<HeadingColor, string> = {
	cream: "text-cream",
	primary: "text-primary",
	accent: "text-accent",
	muted: "text-muted",
};

export default function Heading({
	children,
	size = "md",
	color = "cream",
	className = "",
}: HeadingProps) {
	return (
		<div
			className={`font-pixel uppercase tracking-widest ${sizeStyles[size]} ${colorStyles[color]} ${className}`}>
			{children}
		</div>
	);
}
