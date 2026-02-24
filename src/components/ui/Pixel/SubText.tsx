import type { SubTextProps } from "@/services/types";

export default function SubText({ children, className = "" }: SubTextProps) {
	return (
		<div
			className={`font-pixel text-[8px] text-muted leading-relaxed ${className}`}>
			{children}
		</div>
	);
}
