import type { BoardGridProps } from "@/services/types";

export default function BoardGrid({ children, boardSize }: BoardGridProps) {
	return (
		<div
			className="grid gap-1 w-full"
			style={{
				gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
				aspectRatio: "1/1",
			}}>
			{children}
		</div>
	);
}
