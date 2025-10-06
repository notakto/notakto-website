import type { ReactNode } from "react";

interface SearchContainerProps {
	children: ReactNode;
}

export default function SearchContainer({ children }: SearchContainerProps) {
	return <div className="flex flex-col items-center gap-5">{children}</div>;
}
