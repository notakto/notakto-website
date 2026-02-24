import type { BoardGridProps } from "@/services/types";

const gridColsClass: Record<number, string> = {
	3: "grid-cols-3",
	4: "grid-cols-4",
	5: "grid-cols-5",
};

export default function BoardGrid({ children, boardSize }: BoardGridProps) {
	return (
		<div
			className={`grid gap-1 w-full aspect-square ${gridColsClass[boardSize] ?? "grid-cols-3"}`}>
			{children}
		</div>
	);
}
