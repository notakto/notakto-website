import type { ReactNode } from "react";

interface BoardDisplayProps {
	children: ReactNode;
	visible: boolean;
}

export default function BoardDisplay({ children, visible }: BoardDisplayProps) {
	if (!visible) return null;

	return (
		<div className="flex items-center justify-center w-full p-2 sm:p-3 md:flex-1 md:p-4">
			<div className="max-w-[min(92vw,360px)] sm:max-w-[400px] md:max-w-[520px] w-full">
				{children}
			</div>
		</div>
	);
}
