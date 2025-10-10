import clsx from "clsx";
import type { ReactNode } from "react";

interface BoardLiveContainerProps {
	blocked: boolean;
	children: ReactNode;
}

const BoardLiveContainer = ({ blocked, children }: BoardLiveContainerProps) => (
	<div
		className={clsx(
			"w-[300px] h-[300px] flex flex-wrap bg-black",
			blocked && "opacity-50",
		)}>
		{children}
	</div>
);

export default BoardLiveContainer;
