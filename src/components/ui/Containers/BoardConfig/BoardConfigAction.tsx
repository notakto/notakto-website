import type { BoardConfigActionProps } from "@/services/types";

export default function BoardConfigAction({
	children,
}: BoardConfigActionProps) {
	return <menu className="flex gap-4 pt-2">{children}</menu>;
}
