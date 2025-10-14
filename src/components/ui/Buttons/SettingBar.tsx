import type { ButtonHTMLAttributes } from "react";

interface SettingBarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	text: string;
}
export default function SettingBar({ text, ...props }: SettingBarProps) {
	return (
		<div className="absolute bottom-0 left-0 right-0 flex justify-center items-center bg-blue-600 px-6 py-2 mt-2">
			<button {...props} className="text-white text-[35px]">
				{text}
			</button>
		</div>
	);
}
