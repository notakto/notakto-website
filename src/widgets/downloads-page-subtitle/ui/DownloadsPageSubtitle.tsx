interface DownloadsPageSubtitleProps {
	text: string;
}

export default function DownloadsPageSubtitle({
	text,
}: DownloadsPageSubtitleProps) {
	return (
		<p className="text-center font-pixel text-[8px] text-cream-dim md:mb-8 mb-10">
			{text}
		</p>
	);
}
