import type { DifficultyContainerProps } from "@/services/types";

export default function DifficultyContainer({
	children,
}: DifficultyContainerProps) {
	return <section className="bg-black w-full max-w-md p-6">{children}</section>;
}
