import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ExitBarProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	text: string;
}
export default function ExitBar({ text, ...props }: ExitBarProps) {
	return (
		<div className="w-full bg-rose-700 py-3 text-center mt-auto border-t-3 border-gray-700">
			<button
				{...props}
				className="text-stone-300 text-[10px]  uppercase tracking-wider cursor-pointer">
				{text}
			</button>
		</div>
	);
}
