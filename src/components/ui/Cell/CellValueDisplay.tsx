import clsx from "clsx";
import type { CellValueDisplayProps } from "@/services/types";

export default function CellValueDisplay({
	value,
	owner,
}: CellValueDisplayProps) {
	if (!value) return null;

	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<span
				className={clsx(
					"text-xl font-pixel leading-none",
					owner === 2
						? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
						: "text-x drop-shadow-[0_0_4px_rgba(196,60,60,0.6)]",
				)}>
				{value}
			</span>
		</div>
	);
}
