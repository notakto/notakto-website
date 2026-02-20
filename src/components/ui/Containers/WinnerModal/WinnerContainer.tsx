import type { WinnerContainerProps } from "@/services/types";

export default function WinnerContainer({ children }: WinnerContainerProps) {
	return (
		<section className="bg-panel pixel-border text-center p-4 md:p-6 w-[95%] md:w-[80%] max-w-md">
			{children}
		</section>
	);
}
