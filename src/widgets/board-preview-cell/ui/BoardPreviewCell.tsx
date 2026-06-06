import clsx from "clsx";

interface BoardPreviewCellProps {
	cell: string;
	owner?: 1 | 2;
	isLast: boolean;
}

export default function BoardPreviewCell({
	cell,
	owner,
	isLast,
}: BoardPreviewCellProps) {
	return (
		<div
			className={clsx(
				"relative flex items-center justify-center aspect-square",
				cell === "X" ? "bg-dead" : "bg-board-bg",
				isLast
					? owner === 2
						? "border-2 border-yellow-400"
						: "border-2 border-red-500"
					: "border border-bg3",
			)}>
			{cell && (
				<span
					className={clsx(
						"text-xs font-pixel leading-none",
						owner === 2
							? "text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.6)]"
							: "text-x drop-shadow-[0_0_4px_rgba(196,60,60,0.6)]",
					)}>
					{cell}
				</span>
			)}
		</div>
	);
}
