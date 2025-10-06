import type { ReactNode } from "react";

interface WinnerContainerProps {
	children: ReactNode;
}

export default function WinnerContainer({ children }: WinnerContainerProps) {
	return (
		<div className="bg-black text-center rounded-xl p-6 w-[80%] max-w-md shadow-2xl">
			{children}
		</div>
	);
}
