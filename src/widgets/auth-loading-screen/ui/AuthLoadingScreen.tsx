"use client";

import { useUser } from "@/features/authenticate-user/model/userStore";
import PixelLoadingIndicator from "@/widgets/pixel-loading-indicator/PixelLoadingIndicator";

export default function AuthLoadingScreen() {
	const authReady = useUser((state) => state.authReady);

	if (authReady) return null;

	return (
		<div
			aria-busy="true"
			className="fixed inset-0 z-[9998] flex items-center justify-center bg-bg0 px-6">
			<output
				aria-live="polite"
				aria-label="Loading account"
				className="sr-only">
				Loading account
			</output>
			<PixelLoadingIndicator title="LOADING ACCOUNT" />
		</div>
	);
}
