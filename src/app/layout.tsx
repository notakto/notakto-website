import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "@/app/globals.css";
import type React from "react";
import InitializeClientSession from "@/features/initialize-client-session/ui/InitializeClientSession";
import MusicProvider from "@/features/play-game-audio/ui/MusicProvider";
import DismissibleSplashScreen from "@/widgets/dismissible-splash-screen/ui/DismissibleSplashScreen";
import GlobalModalLayer from "@/widgets/global-modal-layer/ui/GlobalModalLayer";
import SidebarMargin from "@/widgets/sidebar-navigation/ui/SidebarMargin";
import SidebarNavigation from "@/widgets/sidebar-navigation/ui/SidebarNavigation";
import { CustomToastContainer } from "@/widgets/toast-surface/ui/ToastSurface";

export const metadata: Metadata = {
	metadataBase: new URL("https://www.notakto.xyz"),
	title: "Notakto - Misère Tic Tac Toe",
	description:
		"Notakto is a misère and impartial form of tic-tac-toe. No ties, Always a winner. Play against AI or Friends.",
	keywords: [
		"Notakto",
		"misère Tic Tac Toe",
		"X only",
		"Tic Tac Toe variant",
		"retro games",
		"multiplayer",
		"AI board game",
	],
	authors: [{ name: "Notakto Team" }],
	creator: "Notakto Team",

	openGraph: {
		title: "Notakto - Misère Tic Tac Toe",
		description:
			"Notakto is a misère and impartial form of tic-tac-toe. No ties, Always a winner. Play against AI or Friends.",
		url: "https://www.notakto.xyz",
		siteName: "Notakto",
		type: "website",
		images: [
			{
				url: "/preview-img.png",
				width: 1200,
				height: 630,
				alt: "Notakto - Misère Tic Tac Toe",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: "Notakto - Misère Tic Tac Toe",
		description:
			"Notakto is a misère and impartial form of tic-tac-toe. No ties, Always a winner. Play against AI or Friends.",
		images: [
			{
				url: "/preview-img.png",
				width: 1200,
				height: 630,
				alt: "Notakto - Misère Tic Tac Toe",
			},
		],
	},
};
const pressStart2P = Press_Start_2P({
	weight: "400",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={pressStart2P.className}>
			<head>
				<script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4854199776978392"
					crossOrigin="anonymous"></script>
				<meta
					name="google-site-verification"
					content="lxHtpLX2cDKFEAAabqQ3-9IY-ckiw3KvqM3Z1kNPxRo"
				/>
				<meta name="monetag" content="31cbc3974b21341db36f756db33d15d6"></meta>
			</head>
			<body className="bg-bg0 text-pixel-white">
				<MusicProvider />
				<DismissibleSplashScreen />
				<SidebarNavigation />
				<SidebarMargin>{children}</SidebarMargin>
				<GlobalModalLayer />
				<CustomToastContainer />
				<Analytics />
				<SpeedInsights />
				<InitializeClientSession />
			</body>
		</html>
	);
}
