import type { SoundConfigSectionProps } from "@/widgets/ui/types";

export default function SoundConfigSection({
	children,
}: SoundConfigSectionProps) {
	return (
		<div className="my-4 flex items-center justify-between">{children}</div>
	);
}
