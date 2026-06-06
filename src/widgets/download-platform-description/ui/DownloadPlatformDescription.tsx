interface DownloadPlatformDescriptionProps {
	description: string;
}

export default function DownloadPlatformDescription({
	description,
}: DownloadPlatformDescriptionProps) {
	return (
		<div className="font-pixel text-[7px] text-muted mt-1">{description}</div>
	);
}
