import clsx from "clsx";

interface BoardPreviewStatusDotProps {
	dead: boolean;
}

export default function BoardPreviewStatusDot({
	dead,
}: BoardPreviewStatusDotProps) {
	return (
		<span
			className={clsx(
				"w-2.5 h-2.5 rounded-full border border-bg0",
				dead ? "bg-dead" : "bg-success",
			)}
		/>
	);
}
