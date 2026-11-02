import clsx from "clsx";
import type { BuyCoinPackage } from "@/features/buy-coins/model/types";
import { formatCents } from "@/shared/lib/formatCents";
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
			onClick={() => onSelect(coinPackage.packageId)}
			className={clsx(
				"relative grid min-h-56 grid-rows-[auto_1fr_auto] gap-3 bg-slate-800 p-4 text-left  text-stone-300 transition-colors duration-100",
				selected
					? "pixel-border-accent"
					: "pixel-border hover:border-yellow-500",
				disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
			)}
			aria-pressed={selected}>
			{selected && (
				<span className="absolute right-2 top-2 bg-yellow-500 px-2 py-1 text-[6px] text-slate-950">
					SELECTED
				</span>
			)}
			<BuyCoinsCoinStack count={coinPackage.visualCoins} />

			<span>
				<span className="mb-3 block text-sm uppercase tracking-wider text-stone-400">
					{coinPackage.packageName}
				</span>
				<div className="flex items-center justify-between">
					<span className="block text-[13px] uppercase leading-7 text-orange-50">
						{coinPackage.coins}
						<br />
						Coins
					</span>
					<span className="mb-3 text-[13px] block uppercase tracking-wider text-stone-400">
						{formatCents(coinPackage.amountCents)}
					</span>
				</div>
			</span>

			<span className="border-t-3 border-gray-700 pt-3 text-[8px] uppercase tracking-wider text-yellow-500">
				{coinPackage.packageId}
			</span>
		</button>
	);
}
