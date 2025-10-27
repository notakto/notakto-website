import type { ReactNode } from "react";

export const metadata = {
	title: "vsComputer | Notakto",
	description:
		"Challenge the AI in Notakto — the unique X-only tic-tac-toe game! Test your strategy against computer opponents of varying difficulty.",
};

export default function vsComputerLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <>{children}</>;
}
