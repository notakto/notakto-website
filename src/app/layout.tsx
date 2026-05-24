import type { Metadata } from "next";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Press_Start_2P } from "next/font/google";
import ClientSideInit from "@/app/ClientSideInit";
import MusicProvider from "@/components/MusicProvider";
import GlobalModals from "@/components/ui/GlobalModals";
import Sidebar from "@/components/ui/Sidebar/Sidebar";
import SidebarMargin from "@/components/ui/Sidebar/SidebarMargin";
import SplashScreen from "@/components/ui/Splash/SplashScreen";
import { CustomToastContainer } from "@/components/ui/Toasts/CustomToastContainer";

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
				<SplashScreen />
				<Sidebar />
				<SidebarMargin>{children}</SidebarMargin>
				<GlobalModals />
				<CustomToastContainer />
				<Analytics />
				<SpeedInsights />
				<ClientSideInit />
			</body>
		</html>
	);
}
