import type { GameBoardAreaProps } from "@/widgets/ui/types";

export default function GameBoardArea({ children }: GameBoardAreaProps) {
	return <div className="flex-1">{children}</div>;
}
