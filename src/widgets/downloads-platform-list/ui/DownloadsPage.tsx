import { DOWNLOAD_PLATFORMS } from "@/entities/download/model/platforms";
import StaticPageLayout from "@/shared/ui/layout/StaticPageLayout";
import DownloadsPlatformList from "@/widgets/downloads-platform-list/ui/DownloadsPlatformList";

export default function DownloadsPageSurface() {
	return (
		<StaticPageLayout
			maxWidth="md"
			title="Downloads"
			subtitle="GET NOTAKTO FOR YOUR PLATFORM">
			<DownloadsPlatformList platforms={DOWNLOAD_PLATFORMS} />
		</StaticPageLayout>
	);
}
