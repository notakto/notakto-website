"use client";

type LoadingOverlayProps = {
	visible: boolean;
	text?: string;
};

const LoadingOverlay = ({
	visible,
	text = "Loading...",
}: LoadingOverlayProps) => {
	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center">
			<div className="flex flex-col items-center gap-4 text-white">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500  border-t-transparent" />
				<p className="text-lg font-semibold">{text}</p>
			</div>
		</div>
	);
};

export default LoadingOverlay;
