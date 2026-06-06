interface DownloadPlatformIconProps {
	icon: string;
}

export default function DownloadPlatformIcon({
	icon,
}: DownloadPlatformIconProps) {
	return (
		<span className="font-pixel text-xl text-accent w-8 text-center">
			{icon}
		</span>
	);
}
