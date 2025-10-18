import type { ReactNode } from "react";

export const metadata = {
	title: "Live Match | Notakto",
	description:
		"Play Notakto live against real opponents! Join fast-paced matches, challenge players in real time, and see who lasts the longest in this X-only Tic Tac Toe variant.",
};

export default function LiveMatchLayout({ children }: { children: ReactNode }) {
	return <>{children}</>;
}
