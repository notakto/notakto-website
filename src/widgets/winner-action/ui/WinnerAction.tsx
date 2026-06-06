import type { ReactNode } from "react";

interface WinnerActionProps {
	children?: ReactNode;
	className?: string;
}

export default function WinnerAction({ children }: WinnerActionProps) {
	return <menu className="flex justify-between gap-4 w-full">{children}</menu>;
}
