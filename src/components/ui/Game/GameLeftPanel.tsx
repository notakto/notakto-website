import type { ReactNode } from "react";
import type { GameLeftPanelProps } from "@/services/types";

export default function GameLeftPanel({
	children,
	topSlot,
}: GameLeftPanelProps) {
	return (
		<div
			className={`hidden lg:flex w-64 shrink-0 flex-col${topSlot ? " pt-3" : ""}`}>
			{topSlot}
			{children}
		</div>
	);
}
