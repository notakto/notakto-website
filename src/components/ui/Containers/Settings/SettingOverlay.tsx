import type { ReactNode } from "react";

interface SettingOverlayProps {
	children: ReactNode;
}

export default function SettingOverlay({ children }: SettingOverlayProps) {
	return (
		<div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-[9999] flex items-center justify-center px-4 overflow-y-auto">
			{children}
		</div>
	);
}
