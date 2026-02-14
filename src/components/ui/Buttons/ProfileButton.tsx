import type { ButtonHTMLAttributes } from "react";

export function ProfileButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className={
				"bg-red-600 text-white text-2xl px-6 py-3 rounded text-center w-full"
			}
		/>
	);
}
