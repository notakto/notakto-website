import type { ReactNode } from "react";

interface SettingContainerProps {
	children: ReactNode;
}

export default function SettingContainer({ children }: SettingContainerProps) {
	return (
		<div className="flex flex-wrap justify-center gap-4 max-w-4xl py-8">
			{children}
		</div>
	);
}
