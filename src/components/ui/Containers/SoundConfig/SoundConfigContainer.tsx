import type { SoundConfigContainerProps } from "@/services/types";

export default function SoundConfigContainer({
	children,
}: SoundConfigContainerProps) {
	return (
		<div className="bg-black p-6 w-[90%] max-w-xl space-y-6 text-center text-white">
			{children}
		</div>
	);
}
