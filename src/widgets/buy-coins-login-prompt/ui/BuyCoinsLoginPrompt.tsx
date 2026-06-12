interface BuyCoinsLoginPromptProps {
	authReady: boolean;
	error: string | null;
	onSignIn: () => void;
}

export default function BuyCoinsLoginPrompt({
	authReady,
	error,
	onSignIn,
}: BuyCoinsLoginPromptProps) {
	return (
		<div className="bg-bg2 p-5 text-center pixel-border">
			<p className="mb-5 font-pixel text-[9px] uppercase leading-6 text-muted">
				{authReady ? "SIGN IN REQUIRED" : "LOADING ACCOUNT"}
			</p>
			<button
				type="button"
				disabled={!authReady}
				onClick={onSignIn}
				className="w-full border-3 border-border-light bg-primary px-5 py-3 font-pixel text-[9px] uppercase tracking-wider text-cream shadow-[3px_3px_0_var(--color-bg0)] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
				SIGN IN
			</button>
			{error && (
				<p className="mt-4 font-pixel text-[7px] uppercase leading-5 text-primary">
					{error}
				</p>
			)}
		</div>
	);
}
