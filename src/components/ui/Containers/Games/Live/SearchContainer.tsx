import type { SearchContainerProps } from "@/services/types";

export default function SearchContainer({ children }: SearchContainerProps) {
	return <div className="flex flex-col items-center gap-5">{children}</div>;
}
