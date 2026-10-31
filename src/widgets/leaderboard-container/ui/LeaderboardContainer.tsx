import clsx from "clsx";
import type { ReactNode } from "react";

interface LeaderboardContainerProps {
	children?: ReactNode;
	className?: string;
}

export default function LeaderboardContainer({
	children,
	className,
}: LeaderboardContainerProps) {
	return (
		<div
			className={clsx(
				"bg-gray-800 pixel-border p-4 sm:p-8 w-[95%] max-w-3xl space-y-4 sm:space-y-6 text-center text-stone-300",
				className,
			)}>
			{children}
		</div>
	);
}
