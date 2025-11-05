import type { SoundConfigSectionProps } from "@/services/types";

export default function SoundConfigSection({
	children,
}: SoundConfigSectionProps) {
	return (
		<div
			className={`
				my-4 flex items-center justify-between gap-3
				max-[407px]:items-center max-[407px]:justify-start max-[407px]:gap-2
			`}>
			{children}
		</div>
	);
}
