import type { ReactNode } from "react";

interface BoardContainerProps {
	children: ReactNode;
}

export default function BoardContainer({ children }: BoardContainerProps) {
	return (
		<div className="flex flex-wrap justify-center gap-4 p-4 w-full mb-20">
			{children}
		</div>
	);
}
