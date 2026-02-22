import type { DividerProps } from "@/services/types";

export default function Divider({ className = "" }: DividerProps) {
	return (
		<div
			className={`h-[3px] bg-border-pixel my-3 shadow-[0_1px_0_var(--color-bg0)] ${className}`}
		/>
	);
}
