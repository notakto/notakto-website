import type { ReactNode } from "react";

interface BoardConfigOptionsProps {
	children: ReactNode;
}

export default function BoardConfigOptions({
	children,
}: BoardConfigOptionsProps) {
	return (
		<menu className="flex flex-wrap gap-2 justify-center">
			{children}
		</menu>
	);
}
