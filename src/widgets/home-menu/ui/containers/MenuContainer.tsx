import type { MenuContainerProps } from "@/widgets/ui/types";

export default function MenuContainer({ children }: MenuContainerProps) {
	return (
		<div className="flex flex-col items-center gap-4 w-full max-w-md px-4">
			{children}
		</div>
	);
}
