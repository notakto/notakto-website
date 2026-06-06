import type { DownloadPlatform } from "@/entities/download/model/platforms";
import DownloadPlatformAction from "@/widgets/download-platform-action/ui/DownloadPlatformAction";
import DownloadPlatformDescription from "@/widgets/download-platform-description/ui/DownloadPlatformDescription";
import DownloadPlatformIcon from "@/widgets/download-platform-icon/ui/DownloadPlatformIcon";
import DownloadPlatformName from "@/widgets/download-platform-name/ui/DownloadPlatformName";

interface DownloadPlatformCardProps {
	platform: DownloadPlatform;
}

export default function DownloadPlatformCard({
	platform,
}: DownloadPlatformCardProps) {
	return (
		<div className="bg-panel p-6 flex items-center justify-between pixel-border">
			<div className="flex items-center gap-4">
				<DownloadPlatformIcon icon={platform.icon} />
				<div>
					<DownloadPlatformName name={platform.name} />
					<DownloadPlatformDescription description={platform.desc} />
				</div>
			</div>
			<DownloadPlatformAction />
		</div>
	);
}
