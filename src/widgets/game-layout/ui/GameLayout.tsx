import type { ReactNode } from "react";

interface GameLayoutProps {
	children?: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
	return (
		<div className="flex flex-col h-[calc(100dvh-3.5rem)] md:h-dvh bg-bg0 relative overflow-y-auto">
			{children}
		</div>
	);
}
