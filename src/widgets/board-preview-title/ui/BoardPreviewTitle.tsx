interface BoardPreviewTitleProps {
	boardNumber: number;
}

export default function BoardPreviewTitle({
	boardNumber,
}: BoardPreviewTitleProps) {
	return (
		<span className=" text-[9px] sm:text-[10px] text-stone-300 uppercase tracking-wider">
			Board {boardNumber}
		</span>
	);
}
