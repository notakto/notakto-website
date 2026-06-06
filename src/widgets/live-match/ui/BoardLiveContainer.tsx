import clsx from "clsx";
import type { BoardLiveContainerProps } from "@/widgets/types";

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
