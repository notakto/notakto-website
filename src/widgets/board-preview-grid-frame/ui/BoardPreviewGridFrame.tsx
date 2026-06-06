import type { ReactNode } from "react";

interface BoardPreviewGridFrameProps {
	children: ReactNode;
}

export default function BoardPreviewGridFrame({
	children,
}: BoardPreviewGridFrameProps) {
	return (
		<div className="w-full overflow-y-auto p-2 sm:p-3 md:p-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{children}
			</div>
		</div>
	);
}
