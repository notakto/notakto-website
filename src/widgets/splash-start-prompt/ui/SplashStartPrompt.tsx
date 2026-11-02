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
				className=" text-[10px] text-slate-950 bg-yellow-500 border-3 border-zinc-600 px-8 py-3 cursor-pointer hover:bg-yellow-700 shadow-[3px_3px_0_var(--color-slate-950)] transition-all duration-100 uppercase tracking-wider mb-4">
				INSERT COIN
			</button>
			<div className=" text-[8px] text-yellow-500 animate-blink">
				PRESS START
			</div>
		</div>
	);
}
