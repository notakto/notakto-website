import type { ReactNode } from "react";

interface SoundConfigContainerProps {
	children: ReactNode;
}

export default function SoundConfigContainer({
	children,
}: SoundConfigContainerProps) {
	return (
		<div className="bg-blue-300 p-6 w-[90%] max-w-xl space-y-6 text-center text-slate-900">
			{children}
		</div>
	);
}
