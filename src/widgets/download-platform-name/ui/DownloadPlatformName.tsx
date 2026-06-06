interface DownloadPlatformNameProps {
	name: string;
}

export default function DownloadPlatformName({
	name,
}: DownloadPlatformNameProps) {
	return (
		<div className="font-pixel text-[10px] text-cream uppercase">{name}</div>
	);
}
