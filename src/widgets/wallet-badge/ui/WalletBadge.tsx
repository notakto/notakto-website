import WalletDivider from "@/widgets/wallet-divider/ui/WalletDivider";
import WalletValue from "@/widgets/wallet-value/ui/WalletValue";

interface WalletBadgeProps {
	coins: number;
	xp: number;
	onBuyCoins?: () => void;
}

export default function WalletBadge({
	coins,
	xp,
	onBuyCoins,
}: WalletBadgeProps) {
	return (
		<div className="pixel-border bg-slate-800 px-4 py-2.5 flex items-center gap-3 self-start shrink-0">
			<WalletValue value={coins} label="COINS" />
			<WalletDivider />
			<WalletValue value={xp} label="XP" />
			{onBuyCoins && (
				<>
					<WalletDivider />
					<button
						type="button"
						aria-label="Buy coins"
						onClick={onBuyCoins}
						className="h-6 w-6 border-3 border-yellow-500 bg-slate-800  text-[12px] leading-none text-yellow-500 shadow-[2px_2px_0_var(--color-slate-950)] hover:bg-rose-700 hover:text-stone-300 cursor-pointer">
						+
					</button>
				</>
			)}
		</div>
	);
}
