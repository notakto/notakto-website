import type { ReactNode } from "react";

interface WinnerActionProps {
	children: ReactNode;
}

export default function WinnerAction({ children }: WinnerActionProps) {
	const items = Array.isArray(children) ? children : [children];
	return (
		<menu className="flex justify-between gap-4 w-full">
			{items.map((child) => (
				<li key={(child as { key?: string })?.key ?? crypto.randomUUID()}>
					{child}
				</li>
			))}
		</menu>
	);
}
