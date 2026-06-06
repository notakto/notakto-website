interface BoardPreviewTitleProps {
	boardNumber: number;
}

export default function BoardPreviewTitle({
	boardNumber,
}: BoardPreviewTitleProps) {
	return (
		<span className="font-pixel text-[9px] sm:text-[10px] text-cream uppercase tracking-wider">
			Board {boardNumber}
		</span>
	);
}
