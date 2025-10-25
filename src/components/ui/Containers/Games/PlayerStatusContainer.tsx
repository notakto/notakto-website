import type { PlayerStatusContainerProps } from "@/services/types";

export default function PlayerStatusContainer({
	children,
}: PlayerStatusContainerProps) {
	return (
		<div className="flex flex-col items-center px-6 py-4 -mb-8">{children}</div>
	);
}
