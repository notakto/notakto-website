import type { ReactNode } from "react";

interface PixelBorderProps {
	children: ReactNode;
	variant?: "default" | "primary" | "accent";
	className?: string;
}

const variantClass: Record<string, string> = {
	default: "pixel-border",
	primary: "pixel-border-primary",
	accent: "pixel-border-accent",
};

export default function PixelBorder({
	children,
	variant = "default",
	className = "",
}: PixelBorderProps) {
	return (
		<div className={`bg-panel p-4 ${variantClass[variant]} ${className}`}>
			{children}
		</div>
	);
}
