import type { GameContentAreaProps } from "@/services/types";

export default function GameContentArea({ children }: GameContentAreaProps) {
	return (
		<div className="flex gap-2 px-2 sm:gap-3 sm:px-3 md:flex-1 md:gap-4 md:px-4">
			{children}
		</div>
	);
}
