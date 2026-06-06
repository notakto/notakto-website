interface DownloadsPageHeadingProps {
	text: string;
}

export default function DownloadsPageHeading({
	text,
}: DownloadsPageHeadingProps) {
	return (
		<h1 className="font-pixel text-lg text-primary pixel-text-shadow mb-2 uppercase">
			{text}
		</h1>
	);
}
