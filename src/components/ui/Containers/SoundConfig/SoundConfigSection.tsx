import type { ReactNode } from "react";

interface SoundConfigSectionProps {
	children: ReactNode;
}

export default function SoundConfigSection({
	children,
}: SoundConfigSectionProps) {
	return (
		<div className="my-4 flex items-center justify-between">{children}</div>
	);
}
