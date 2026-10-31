import type { Metadata } from "next";
import type React from "react";

export const metadata: Metadata = {
	title: "Downloads | Notakto",
	description: "Download Notakto for your platform",
};

export default function DownloadsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
