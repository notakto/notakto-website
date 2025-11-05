import type { ButtonHTMLAttributes } from "react";

export function SoundMuteButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={`
				bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 w-[67px] text-lg
				max-[407px]:w-[60px] max-[407px]:text-base max-[407px]:py-1
			`}
		/>
	);
}
