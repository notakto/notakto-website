import clsx from "clsx";
import type { BuyCoinPackage } from "@/features/buy-coins/model/types";
import BuyCoinsCoinStack from "@/widgets/buy-coins-coin-stack/ui/BuyCoinsCoinStack";

interface BuyCoinsPackageCardProps {
	coinPackage: BuyCoinPackage;
	disabled?: boolean;
	selected: boolean;
	onSelect: (packageId: string) => void;
}

export default function BuyCoinsPackageCard({
	coinPackage,
	disabled,
	selected,
	onSelect,
}: BuyCoinsPackageCardProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={() => onSelect(coinPackage.id)}
			className={clsx(
				"relative grid min-h-56 grid-rows-[auto_1fr_auto] gap-3 bg-bg2 p-4 text-left font-pixel text-cream transition-colors duration-100",
				selected ? "pixel-border-accent" : "pixel-border hover:border-accent",
				disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
			)}
			aria-pressed={selected}>
			{selected && (
				<span className="absolute right-2 top-2 bg-accent px-2 py-1 text-[6px] text-bg0">
					SELECTED
				</span>
			)}
			<BuyCoinsCoinStack count={coinPackage.visualCoins} />
			<span>
				<span className="mb-3 block text-[7px] uppercase tracking-wider text-cream-dim">
					{coinPackage.name}
				</span>
				<span className="block text-[13px] uppercase leading-7 text-pixel-white">
					{coinPackage.coins}
					<br />
					Coins
				</span>
			</span>
			<span className="border-t-3 border-border-pixel pt-3 text-[8px] uppercase tracking-wider text-accent">
				{coinPackage.id}
			</span>
		</button>
	);
}
