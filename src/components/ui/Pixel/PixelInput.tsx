import type { PixelInputProps } from "@/services/types";

export default function PixelInput({
	className = "",
	...props
}: PixelInputProps) {
	return (
		<input
			className={`font-pixel text-[9px] text-cream bg-bg0 border-2 border-border-pixel px-3 py-2 outline-none focus:border-border-light ${className}`}
			{...props}
		/>
	);
}
