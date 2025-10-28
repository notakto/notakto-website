import type { GameLayoutProps } from "@/services/types";

export default function GameLayout({ children }: GameLayoutProps) {
	return (
		<div className="flex flex-col min-h-screen bg-black bg-[url('/background.png')] bg-no-repeat bg-cover bg-center relative">
			{children}
		</div>
	);
}
