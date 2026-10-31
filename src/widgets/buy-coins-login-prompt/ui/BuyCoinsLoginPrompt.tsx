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
		<div className="bg-slate-800 p-3 text-center pixel-border">
			<p className="mb-5  text-[9px] uppercase leading-6 text-gray-500">
				{authReady ? "SIGN IN REQUIRED" : "LOADING ACCOUNT"}
			</p>
			<button
				type="button"
				disabled={!authReady}
				onClick={onSignIn}
				className="w-50 lg:w-100 border-3 border-zinc-600 bg-rose-700 px-5 py-3  text-[9px] uppercase tracking-wider text-stone-300 shadow-[3px_3px_0_var(--color-slate-950)] hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60">
				SIGN IN
			</button>
			{error && (
				<p className="mt-4  text-[7px] uppercase leading-5 text-rose-700">
					{error}
				</p>
			)}
		</div>
	);
}
