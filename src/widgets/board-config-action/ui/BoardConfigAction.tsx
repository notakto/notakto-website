import type { ReactNode } from "react";

interface BoardConfigActionProps {
	children?: ReactNode;
	className?: string;
}

export default function BoardConfigAction({
	children,
}: BoardConfigActionProps) {
	return <menu className="flex gap-4 pt-2">{children}</menu>;
}
