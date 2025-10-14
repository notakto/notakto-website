import type { ReactNode } from "react";

interface WinnerActionProps {
	children: ReactNode;
}

export default function WinnerAction({ children }: WinnerActionProps) {
	return <div className="flex justify-between gap-4 w-full">{children}</div>;
}
