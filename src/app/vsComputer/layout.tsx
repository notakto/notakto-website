import type { ReactNode } from "react";

export const metadata = {
	title: "vsComputer | Notakto",
	description:
		"Challenge the Notakto AI in Player vs Computer mode! Play X-only Tic Tac Toe against a smart opponent and improve your strategy.",
};

export default function vsComputerLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <>{children}</>;
}
