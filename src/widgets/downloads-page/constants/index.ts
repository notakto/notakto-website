import type { DownloadPlatform } from "@/entities/download/model/platforms";

export const DOWNLOAD_PLATFORMS: DownloadPlatform[] = [
	{ name: "WINDOWS", icon: "W", desc: "Windows 10+" },
	{ name: "MACOS", icon: "M", desc: "macOS 12+" },
	{ name: "LINUX", icon: "L", desc: "Ubuntu 20.04+" },
	{ name: "ANDROID", icon: "A", desc: "Android 10+" },
	{ name: "IOS", icon: "I", desc: "iOS 15+" },
];
