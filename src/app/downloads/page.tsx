"use client";

import PlatformCardList from "@/components/ui/Cards/PlatformCardList";
import StaticPageLayout from "@/components/ui/Layout/StaticPageLayout";

const PLATFORMS = [
	{ name: "WINDOWS", icon: "W", desc: "Windows 10+" },
	{ name: "MACOS", icon: "M", desc: "macOS 12+" },
	{ name: "LINUX", icon: "L", desc: "Ubuntu 20.04+" },
	{ name: "ANDROID", icon: "A", desc: "Android 10+" },
	{ name: "IOS", icon: "I", desc: "iOS 15+" },
];

export default function DownloadsPage() {
	return (
		<StaticPageLayout
			maxWidth="md"
			title="Downloads"
			subtitle="GET NOTAKTO FOR YOUR PLATFORM">
			<PlatformCardList platforms={PLATFORMS} />
		</StaticPageLayout>
	);
}
