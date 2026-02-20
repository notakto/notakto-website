import type { DifficultyContainerProps } from "@/services/types";

export default function DifficultyContainer({
	children,
}: DifficultyContainerProps) {
	return (
		<section className="bg-panel pixel-border w-[95%] md:w-full max-w-md p-4 md:p-6">
			{children}
		</section>
	);
}
