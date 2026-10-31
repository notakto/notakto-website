import type { ReactNode } from "react";

interface SoundConfigContainerProps {
	children?: ReactNode;
	className?: string;
}

export default function SoundConfigContainer({
	children,
}: SoundConfigContainerProps) {
	return (
		<div className="bg-gray-800 pixel-border p-6 w-[90%] max-w-xl space-y-6 text-center text-stone-300">
			{children}
		</div>
	);
}
