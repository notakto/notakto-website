import type { Metadata } from "next";
import type { ReactNode } from "react";
import InitializeClientSession from "@/features/initialize-client-session/ui/InitializeClientSession";

export const metadata: Metadata = {
	title: "vsComputer | Notakto",
	description:
		"Challenge the AI in Notakto — the unique X-only tic-tac-toe game! Test your strategy against computer opponents of varying difficulty.",
};

export default function vsComputerLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			{children}
			<InitializeClientSession />
		</>
	);
}
