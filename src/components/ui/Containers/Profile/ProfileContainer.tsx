import type { ProfileContainerProps } from "@/services/types";

export default function ProfileContainer({ children }: ProfileContainerProps) {
	return (
		<div className="bg-panel pixel-border p-4 md:p-6 w-[95%] md:w-[80%] max-w-md">
			{children}
		</div>
	);
}
