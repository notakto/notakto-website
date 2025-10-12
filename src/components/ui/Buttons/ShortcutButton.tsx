import type { ButtonHTMLAttributes } from "react";

export function ShortcutButton({
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			{...props}
			className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-xl w-full mt-4"
		/>
	);
}
