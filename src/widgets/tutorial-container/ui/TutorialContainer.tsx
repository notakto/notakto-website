import type { ReactNode } from "react";

interface TutorialContainerProps {
	children?: ReactNode;
	className?: string;
}

export default function TutorialContainer({
	children,
}: TutorialContainerProps) {
	return (
		<div className="bg-gray-800 pixel-border p-4 md:p-6 w-[95%] md:w-[80%] max-w-md">
			{children}
		</div>
	);
}
