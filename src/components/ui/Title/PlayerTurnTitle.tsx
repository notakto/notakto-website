"use client";
import type { PlayerTurnTitleProps } from "@/services/types";

const PlayerTurnTitle = ({
	variant = "normal",
	text,
}: PlayerTurnTitleProps) => {
	if (variant === "normal") {
		return (
			<h2 className="text-cream font-pixel uppercase tracking-widest text-[20px] mb-5 text-center pixel-text-shadow">
				{text}
			</h2>
		);
	} else {
		return (
			<h1 className="text-base text-cream font-pixel uppercase tracking-widest mb-6 pixel-text-shadow">
				{text}
			</h1>
		);
	}
};

export default PlayerTurnTitle;
