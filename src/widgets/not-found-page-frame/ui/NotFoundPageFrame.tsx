import type { ReactNode } from "react";

interface NotFoundPageFrameProps {
	children: ReactNode;
}

export default function NotFoundPageFrame({
	children,
}: NotFoundPageFrameProps) {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-bg0 text-center p-4">
			{children}
		</main>
	);
}
