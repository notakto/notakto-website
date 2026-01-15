import type { ReactNode } from "react";

export const metadata = {
	title: "vsPlayer | Notakto",
	description:
		"Play Notakto offline with a friend in Player vs Player mode! Enter your names and enjoy fast-paced X-only Tic Tac Toe together.",
};

export default function vsPlayerLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
