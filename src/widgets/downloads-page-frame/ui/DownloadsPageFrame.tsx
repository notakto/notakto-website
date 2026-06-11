import type { ReactNode } from "react";

interface DownloadsPageFrameProps {
	children: ReactNode;
}

export default function DownloadsPageFrame({
	children,
}: DownloadsPageFrameProps) {
	return (
		<div className="max-h-screen bg-bg0 p-4 md:p-8 overflow-none">
			<div className="max-w-3xl mx-auto">{children}</div>
		</div>
	);
}
