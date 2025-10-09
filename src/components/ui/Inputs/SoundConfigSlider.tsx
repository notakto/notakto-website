import type { InputHTMLAttributes } from "react";

export function SoundConfigSlider({
	id,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			{...props}
			id={id}
			type="range"
			min="0"
			max="100"
			className={"flex-2 mx-2 accent-[#0055ff]"}
		/>
	);
}
