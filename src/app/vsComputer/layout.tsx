import type { ReactNode } from "react";
import ClientSideInit from "@/app/providers/ClientSideInit";

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
	return (
		<>
			{children}
			<ClientSideInit />
			{/* Better to put this in global layout.tsx and access it from there */}
		</>
	);
}
