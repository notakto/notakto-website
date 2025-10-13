import type { ReactNode } from "react";

interface BoardConfigActionProps {
	children: ReactNode;
}

export default function BoardConfigAction({
	children,
}: BoardConfigActionProps) {
	return <div className="flex gap-4 pt-2">{children}</div>;
}
