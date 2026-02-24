import type { WalletBadgeProps } from "@/services/types";

export default function WalletBadge({ coins, xp }: WalletBadgeProps) {
	return (
		<div className="pixel-border bg-bg2 px-4 py-2.5 flex items-center gap-3 self-start shrink-0">
			<span className="font-pixel text-[10px] text-accent">{coins} COINS</span>
			<span className="font-pixel text-[7px] text-border-pixel">|</span>
			<span className="font-pixel text-[10px] text-accent">{xp} XP</span>
		</div>
	);
}
