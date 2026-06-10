"use client";

import { useDismissibleSplash } from "@/features/dismiss-splash/model/useDismissibleSplash";
import SplashScreen from "@/widgets/splash-screen/ui/SplashScreen";

export default function DismissibleSplashScreen() {
	const splash = useDismissibleSplash();

	return <SplashScreen {...splash} />;
}
