import clsx from "clsx";
import type { SingleBoardContainerProps } from "@/widgets/ui/types";

export default function SingleBoardContainer({
	children,
	isDead,
}: SingleBoardContainerProps) {
	return (
		<div className={clsx("flex-1 p-2 max-w-full", isDead && "opacity-60")}>
			{children}
		</div>
	);
}
