import type { ButtonHTMLAttributes } from "react";

export function PlayerStartButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={
				"bg-blue-600 text-white text-3xl w-full py-3 hover:bg-blue-700"
			}
			{...props}
		/>
	);
}
