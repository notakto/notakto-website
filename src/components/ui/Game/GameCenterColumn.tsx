import type { ReactNode } from "react";

interface GameCenterColumnProps {
	children: ReactNode;
	/** Rendered above the board, visible only below lg breakpoint */
	mobileBoardSelector?: ReactNode;
}

export default function GameCenterColumn({
	children,
	mobileBoardSelector,
}: GameCenterColumnProps) {
	return (
		<div className="flex flex-col items-center md:flex-1">
			{mobileBoardSelector && (
				<div className="lg:hidden w-full flex justify-center shrink-0 py-1.5 sm:py-2">
					{mobileBoardSelector}
				</div>
			)}
			{children}
		</div>
	);
}
