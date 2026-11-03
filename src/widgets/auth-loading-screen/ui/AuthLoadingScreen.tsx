import PixelLoadingIndicator from "@/widgets/pixel-loading-indicator/PixelLoadingIndicator";

interface AuthLoadingScreenProps {
	visible: boolean;
}

export default function AuthLoadingScreen({ visible }: AuthLoadingScreenProps) {
	if (!visible) return null;

	return (
		<output
			className="fixed inset-0 z-[10000] flex items-center justify-center bg-bg0"
			aria-live="polite"
			aria-label="Signing in">
			<PixelLoadingIndicator title="Signing in..." />
		</output>
	);
}
