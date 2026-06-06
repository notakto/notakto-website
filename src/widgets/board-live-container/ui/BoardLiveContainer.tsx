import clsx from "clsx";
import type { ReactNode } from "react";

interface BoardLiveContainerProps {
	children?: ReactNode;
	className?: string;
	blocked: boolean;
}

const BoardLiveContainer = ({ blocked, children }: BoardLiveContainerProps) => (
	<div
		className={clsx(
			"w-full max-w-75 aspect-square flex flex-wrap bg-board-bg pixel-border",
			blocked && "opacity-50",
		)}>
		{children}
	</div>
);

export default BoardLiveContainer;
