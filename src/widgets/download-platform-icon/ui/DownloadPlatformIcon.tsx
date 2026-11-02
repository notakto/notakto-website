interface DownloadPlatformIconProps {
	icon: string;
}

export default function DownloadPlatformIcon({
	icon,
}: DownloadPlatformIconProps) {
	return (
		<span className=" text-xl text-yellow-500 w-8 text-center">{icon}</span>
	);
}
