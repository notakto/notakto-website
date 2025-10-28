import type { BoardConfigOptionsProps } from "@/services/types";

export default function BoardConfigOptions({
	children,
}: BoardConfigOptionsProps) {
	return <ul className="flex flex-wrap gap-2 justify-center">{children}</ul>;
}
