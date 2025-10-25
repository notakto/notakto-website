import type { BoardGridContainerProps } from "@/services/types";

export default function BoardGridContainer({
	children,
}: BoardGridContainerProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
			{children}
		</div>
	);
}
