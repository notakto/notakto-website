import type { StatContainerProps } from "@/widgets/ui/types";

export default function StatContainer({ children }: StatContainerProps) {
	return (
		<div className="flex flex-row justify-center items-center -mt-2">
			{children}
		</div>
	);
}
