"use client";
import type { PlayerTurnTitleProps } from "@/services/types";

const PlayerTurnTitle = ({ text }: PlayerTurnTitleProps) => {
	return <h2 className="text-red-600 text-[80px] mb-5 text-center">{text}</h2>;
};

export default PlayerTurnTitle;
