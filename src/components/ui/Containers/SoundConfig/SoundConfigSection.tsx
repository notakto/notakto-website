import type { SoundConfigSectionProps } from "@/services/types";

export default function SoundConfigSection({
	children,
}: SoundConfigSectionProps) {
	return (
		<div className="my-4 flex items-center justify-between">{children}</div>
	);
}
