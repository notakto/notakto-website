interface DownloadsPageSubtitleProps {
	text: string;
}

export default function DownloadsPageSubtitle({
	text,
}: DownloadsPageSubtitleProps) {
	return (
		<p className="text-center  text-[8px] text-stone-400 md:mb-8 mb-10">
			{text}
		</p>
	);
}
