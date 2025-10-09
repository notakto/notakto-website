import type { ReactNode } from "react";

interface BoardWrapperProps {
	children: ReactNode;
}

export default function BoardWrapper({ children }: BoardWrapperProps) {
	return (
		<div
			className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.3%-1.5rem)]"
			style={{ maxWidth: "400px" }}>
			{children}
		</div>
	);
}
