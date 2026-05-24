import type { BoardContainerProps } from "@/widgets/ui/types";

export default function BoardContainer({ children }: BoardContainerProps) {
	return (
		<div className="flex flex-wrap justify-center gap-4 p-4 w-full">
			{children}
		</div>
	);
}
