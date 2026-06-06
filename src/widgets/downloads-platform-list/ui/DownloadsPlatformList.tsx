import type { DownloadPlatform } from "@/entities/download/model/platforms";
import DownloadPlatformCard from "@/widgets/download-platform-card/ui/DownloadPlatformCard";

interface PlatformCardListProps {
	platforms: DownloadPlatform[];
}

export default function DownloadsPlatformList({
	platforms,
}: PlatformCardListProps) {
	return (
		<div className="grid gap-4">
			{platforms.map((p) => (
				<DownloadPlatformCard key={p.name} platform={p} />
			))}
		</div>
	);
}
