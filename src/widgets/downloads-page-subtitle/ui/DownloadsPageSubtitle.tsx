interface DownloadsPageSubtitleProps {
	text: string;
}

export default function DownloadsPageSubtitle({
	text,
}: DownloadsPageSubtitleProps) {
	return <p className="font-pixel text-[8px] text-cream-dim mb-8">{text}</p>;
}
