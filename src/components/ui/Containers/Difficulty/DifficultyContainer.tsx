import type { ReactNode } from "react";

interface DifficultyContainerProps {
	children: ReactNode;
}

export default function DifficultyContainer({
	children,
}: DifficultyContainerProps) {
	return <section className="bg-black w-full max-w-md p-6">{children}</section>;
}
