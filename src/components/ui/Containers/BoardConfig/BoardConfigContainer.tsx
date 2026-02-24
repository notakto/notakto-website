import type { BoardConfigContainerProps } from "@/services/types";

export default function BoardConfigContainer({
	children,
}: BoardConfigContainerProps) {
	return (
		<section className="bg-panel pixel-border p-4 md:p-6 w-[95%] md:w-[90%] max-w-xl text-center space-y-6">
			{children}
		</section>
	);
}
