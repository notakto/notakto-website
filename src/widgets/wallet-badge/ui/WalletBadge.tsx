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
		<div className="pixel-border bg-bg2 px-4 py-2.5 flex items-center gap-3 self-start shrink-0">
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
						className="h-6 w-6 border-3 border-accent bg-bg3 font-pixel text-[12px] leading-none text-accent shadow-[2px_2px_0_var(--color-bg0)] hover:bg-primary hover:text-cream cursor-pointer">
						+
					</button>
				</>
			)}
		</div>
	);
}
