import type { PlayerNameContainerProps } from "@/services/types";

export default function PlayerNameModalContainer({
	children,
}: PlayerNameContainerProps) {
	return (
		<section className="bg-panel pixel-border w-[95%] md:w-[80%] max-w-md p-4 md:p-6 text-center">
			{children}
		</section>
	);
}
