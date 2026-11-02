interface DownloadPlatformNameProps {
	name: string;
}

export default function DownloadPlatformName({
	name,
}: DownloadPlatformNameProps) {
	return <div className=" text-[10px] text-stone-300 uppercase">{name}</div>;
}
