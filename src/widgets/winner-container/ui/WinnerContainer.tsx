import type { ReactNode } from "react";

interface WinnerContainerProps {
	children?: ReactNode;
	className?: string;
}

export default function WinnerContainer({ children }: WinnerContainerProps) {
	return (
		<section className="bg-panel pixel-border text-center p-4 md:p-6 w-[95%] md:w-[80%] max-w-md">
			{children}
		</section>
	);
}
