import type { ReactNode } from "react";

interface StatContainerProps {
	children: ReactNode;
}

export default function StatContainer({ children }: StatContainerProps) {
	return (
		<div className="flex flex-row justify-center items-center -mt-2">
			{children}
		</div>
	);
}
