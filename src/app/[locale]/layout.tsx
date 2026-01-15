import type { Metadata } from "next";
import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VT323 } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ClientSideInit from "@/app/ClientSideInit";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MusicProvider from "@/components/MusicProvider";
import { CustomToastContainer } from "@/components/ui/Toasts/CustomToastContainer";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
	title: "Menu | Notakto",
	description: "No ties, Always a winner",
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
};
const vt323 = VT323({
	weight: "400",
	subsets: ["latin"],
});

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	// Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
		notFound();
	}

	// Providing all messages to the client
	const messages = await getMessages();

	return (
		<html lang={locale} className={vt323.className}>
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
			<body>
				<NextIntlClientProvider messages={messages}>
					<LanguageSwitcher />
					<MusicProvider />
					{children}
					<CustomToastContainer />
					<Analytics />
					<SpeedInsights />
					<ClientSideInit />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
