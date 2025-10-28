import type { SettingContainerProps } from "@/services/types";

export default function SettingContainer({ children }: SettingContainerProps) {
	return (
		<div className="flex flex-wrap justify-center gap-4 max-w-4xl py-8">
			{children}
		</div>
	);
}
