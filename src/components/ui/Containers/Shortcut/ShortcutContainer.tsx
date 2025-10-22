import type { ReactNode } from "react";

interface ShortcutContainerProps {
	children: ReactNode;
}

export default function ShortcutContainer({
	children,
}: ShortcutContainerProps) {
	return (
		<div className="bg-black p-6 w-[90%] max-w-md space-y-6 text-white shadow-lg">
			{children}
		</div>
	);
}
