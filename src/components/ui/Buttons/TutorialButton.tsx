import type { ButtonHTMLAttributes } from "react";

export function TutorialButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={
				"bg-red-600 text-white text-xl px-6 py-3 rounded text-center w-full"
			}
		/>
	);
}
