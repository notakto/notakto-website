import type { LiveContainerProps } from "@/services/types";

export default function LiveContainer({ children }: LiveContainerProps) {
	return (
		<div className="flex-1 flex flex-col justify-center items-center px-4 overflow-y-auto min-h-0">
			{children}
		</div>
	);
}
