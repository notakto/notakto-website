import WalletDivider from "@/widgets/wallet-divider/ui/WalletDivider";
import WalletValue from "@/widgets/wallet-value/ui/WalletValue";

interface WalletBadgeProps {
	coins: number;
	xp: number;
}

export default function WalletBadge({ coins, xp }: WalletBadgeProps) {
	return (
		<div className="pixel-border bg-bg2 px-4 py-2.5 flex items-center gap-3 self-start shrink-0">
			<WalletValue value={coins} label="COINS" />
			<WalletDivider />
			<WalletValue value={xp} label="XP" />
		</div>
	);
}
