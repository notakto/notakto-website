import type { TutorialContainerProps } from "@/services/types";

export default function TutorialContainer({
	children,
}: TutorialContainerProps) {
	return (
		<div className="bg-blue-600 p-6 w-[80%] max-w-md shadow-xl">{children}</div>
	);
}
