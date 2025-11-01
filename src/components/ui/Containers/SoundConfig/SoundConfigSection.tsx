import type { SoundConfigSectionProps } from "@/services/types";

export default function SoundConfigSection({
	children,
}: SoundConfigSectionProps) {
	return (
		<div className="my-4 flex items-center justify-between max-[407px]:flex-col max-[407px]:items-start max-[407px]:gap-y-2">
			{children}
		</div>
	);
}
