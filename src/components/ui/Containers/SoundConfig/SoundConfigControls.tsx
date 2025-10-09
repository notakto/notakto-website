import type { ReactNode } from "react";

interface SoundConfigControlsProps {
	children: ReactNode;
}

export default function SoundConfigControls({
	children,
}: SoundConfigControlsProps) {
	return (
		<div className="mt-6 flex flex-wrap gap-3 justify-center">{children}</div>
	);
}
