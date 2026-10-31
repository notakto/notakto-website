interface DownloadPlatformDescriptionProps {
	description: string;
}

export default function DownloadPlatformDescription({
	description,
}: DownloadPlatformDescriptionProps) {
	return <div className=" text-[7px] text-gray-500 mt-1">{description}</div>;
}
