import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "vsPlayer | Notakto",
	description:
		"Play Notakto offline with a friend in Player vs Player mode! Enter your names and enjoy fast-paced X-only Tic Tac Toe together.",
};

export default function vsPlayerLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
