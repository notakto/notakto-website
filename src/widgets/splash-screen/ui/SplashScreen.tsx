import SplashBootText from "@/widgets/splash-boot-text/ui/SplashBootText";
import SplashStartPrompt from "@/widgets/splash-start-prompt/ui/SplashStartPrompt";
import SplashSystemCheck from "@/widgets/splash-system-check/ui/SplashSystemCheck";
import SplashTitleBlock from "@/widgets/splash-title-block/ui/SplashTitleBlock";

interface SplashScreenProps {
	visible: boolean;
	phase: number;
	onDismiss: () => void;
}

export default function SplashScreen({
	visible,
	phase,
	onDismiss,
}: SplashScreenProps) {
	if (!visible) return null;

	return (
		<div className="fixed inset-0 z-9999 bg-bg0 flex flex-col items-center justify-center">
			<SplashBootText dimmed={phase > 0} />
			{phase >= 1 && <SplashSystemCheck dimmed={phase > 1} />}
			{phase >= 2 && <SplashTitleBlock />}
			{phase >= 3 && <SplashStartPrompt onDismiss={onDismiss} />}
		</div>
	);
}
