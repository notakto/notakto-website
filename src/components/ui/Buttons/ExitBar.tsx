import type { ExitBarProps } from "@/services/types";
export default function ExitBar({ text, ...props }: ExitBarProps) {
	return (
		<div className="w-full bg-primary py-3 text-center mt-auto border-t-3 border-border-pixel">
			<button
				{...props}
				className="text-cream text-[10px] font-pixel uppercase tracking-wider cursor-pointer">
				{text}
			</button>
		</div>
	);
}
