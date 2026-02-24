import type { SettingBarProps } from "@/services/types";
export default function SettingBar({ text, ...props }: SettingBarProps) {
	return (
		<div className="absolute bottom-0 left-0 right-0 flex justify-center items-center bg-primary px-6 py-2 mt-2 border-t-3 border-border-pixel">
			<button
				{...props}
				className="text-cream text-sm font-pixel uppercase tracking-wider cursor-pointer">
				{text}
			</button>
		</div>
	);
}
