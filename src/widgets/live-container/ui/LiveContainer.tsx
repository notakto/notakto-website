import type { ReactNode } from "react";

interface LiveContainerProps {
	children?: ReactNode;
	className?: string;
}

export default function LiveContainer({ children }: LiveContainerProps) {
	return (
		<div className="flex-1 flex flex-col justify-center items-center px-4 overflow-y-auto min-h-0">
			{children}
		</div>
	);
}
