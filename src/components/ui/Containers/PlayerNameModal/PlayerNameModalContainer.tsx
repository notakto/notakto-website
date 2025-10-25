import type { PlayerNameContainerProps } from "@/services/types";

export default function PlayerNameModalContainer({
	children,
}: PlayerNameContainerProps) {
	return (
		<div className="bg-black w-[80%] max-w-md p-6 text-center shadow-lg">
			{children}
		</div>
	);
}
