import { DOWNLOAD_PLATFORMS } from "@/widgets/downloads-page/constants";
import DownloadsPageFrame from "@/widgets/downloads-page-frame/ui/DownloadsPageFrame";
import DownloadsPageHeading from "@/widgets/downloads-page-heading/ui/DownloadsPageHeading";
import DownloadsPageSubtitle from "@/widgets/downloads-page-subtitle/ui/DownloadsPageSubtitle";
import DownloadsPlatformList from "@/widgets/downloads-platform-list/ui/DownloadsPlatformList";

export default function DownloadsPageSurface() {
	return (
		<DownloadsPageFrame>
			<DownloadsPageHeading text="Downloads" />
			<DownloadsPageSubtitle text="GET NOTAKTO FOR YOUR PLATFORM" />
			<DownloadsPlatformList platforms={DOWNLOAD_PLATFORMS} />
		</DownloadsPageFrame>
	);
}
