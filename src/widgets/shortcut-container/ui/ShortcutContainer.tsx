import type { ReactNode } from "react";

interface ShortcutContainerProps {
	children?: ReactNode;
	className?: string;
}

export default function ShortcutContainer({
	children,
}: ShortcutContainerProps) {
	return (
		<section className="bg-gray-800 pixel-border p-6 w-[90%] max-w-md space-y-6 text-stone-300">
			{children}
		</section>
	);
}
