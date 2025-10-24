import type { ReactNode } from "react";

interface GameBoardAreaProps {
	children: ReactNode;
}

export default function GameBoardArea({ children }: GameBoardAreaProps) {
	return <div className="flex-1">{children}</div>;
}
