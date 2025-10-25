import type { GameBoardAreaProps } from "@/services/types";

export default function GameBoardArea({ children }: GameBoardAreaProps) {
	return <div className="flex-1">{children}</div>;
}
