import type { ProfileContainerProps } from "@/services/types";

export default function ProfileContainer({ children }: ProfileContainerProps) {
	return (
		<div className="bg-blue-600 p-6 w-[80%] max-w-md shadow-xl">{children}</div>
	);
}
