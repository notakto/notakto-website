import type { ReactNode } from "react";

interface MenuContainerProps {
	children: ReactNode;
}

export default function MenuContainer({ children }: MenuContainerProps) {
	return (
		<div className="flex flex-col items-center gap-0 w-full max-w-md px-4 pb-8">
			{children}
		</div>
	);
}
