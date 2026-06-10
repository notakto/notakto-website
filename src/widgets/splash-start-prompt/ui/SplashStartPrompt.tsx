interface SplashStartPromptProps {
	onDismiss: () => void;
}

export default function SplashStartPrompt({
	onDismiss,
}: SplashStartPromptProps) {
	return (
		<div className="text-center animate-slide-up">
			<button
				type="button"
				onClick={onDismiss}
				className="font-pixel text-[10px] text-bg0 bg-accent border-3 border-border-light px-8 py-3 cursor-pointer hover:bg-accent-dim shadow-[3px_3px_0_var(--color-bg0)] transition-all duration-100 uppercase tracking-wider mb-4">
				INSERT COIN
			</button>
			<div className="font-pixel text-[8px] text-accent animate-blink">
				PRESS START
			</div>
		</div>
	);
}
