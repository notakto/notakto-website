import type { WinnerActionProps } from "@/widgets/ui/types";

export default function WinnerAction({ children }: WinnerActionProps) {
	return <menu className="flex justify-between gap-4 w-full">{children}</menu>;
}
