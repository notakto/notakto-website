import type { WinnerActionProps } from "@/services/types";

export default function WinnerAction({ children }: WinnerActionProps) {
	return <menu className="flex justify-between gap-4 w-full">{children}</menu>;
}
