import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { ReactNode } from "react";
import InitializeClientSession from "@/features/initialize-client-session/ui/InitializeClientSession";
import MusicProvider from "@/features/play-game-audio/ui/MusicProvider";
import GlobalModalLayer from "@/widgets/global-modal-layer/ui/GlobalModalLayer";
import SidebarMargin from "@/widgets/sidebar-navigation/ui/SidebarMargin";
import SidebarNavigation from "@/widgets/sidebar-navigation/ui/SidebarNavigation";
import SplashScreen from "@/widgets/splash-screen/ui/SplashScreen";
import { CustomToastContainer } from "@/widgets/toast-surface/ui/ToastSurface";

export default function AppShell({ children }: { children: ReactNode }) {
	return (
		<>
			<MusicProvider />
			<SplashScreen />
			<SidebarNavigation />
			<SidebarMargin>{children}</SidebarMargin>
			<GlobalModalLayer />
			<CustomToastContainer />
			<Analytics />
			<SpeedInsights />
			<InitializeClientSession />
		</>
	);
}
