import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { VT323 } from "next/font/google";
import { CustomToastContainer } from "@/components/ui/Toasts/CustomToastContainer";
import MusicProvider from "@/components/MusicProvider";

export const metadata: Metadata = {
  title: "Notakto",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={vt323.className}>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4854199776978392"
          crossOrigin="anonymous"
        ></script>
        <meta
          name="google-site-verification"
          content="lxHtpLX2cDKFEAAabqQ3-9IY-ckiw3KvqM3Z1kNPxRo"
        />
        <meta name="monetag" content="31cbc3974b21341db36f756db33d15d6"></meta>
      </head>
      <body>
        <MusicProvider/>
        {children}
        <CustomToastContainer/>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
