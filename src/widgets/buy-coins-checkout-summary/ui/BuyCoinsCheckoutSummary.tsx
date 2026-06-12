import type {
	BuyCoinPackage,
	BuyCoinsFlowStatus,
	BuyCoinsProviderStatus,
} from "@/features/buy-coins/model/types";
import BuyCoinsStatusLine from "@/widgets/buy-coins-status-line/ui/BuyCoinsStatusLine";

interface BuyCoinsCheckoutSummaryProps {
	checkoutOpenBlocked: boolean;
	confirmedAmountCents: number | null;
	currentCoins: number;
	error: string | null;
	flowStatus: BuyCoinsFlowStatus;
	hostedUrl: string | null;
	isBusy: boolean;
	onOpenCheckout: () => void;
	onStartCheckout: () => void;
	providerStatus: BuyCoinsProviderStatus;
	selectedPackage: BuyCoinPackage;
}

function formatCents(amountCents: number) {
	return `$${(amountCents / 100).toFixed(2)}`;
}

function getActionLabel(flowStatus: BuyCoinsFlowStatus) {
	if (flowStatus === "creating") return "CREATING CHECKOUT";
	if (flowStatus === "polling") return "CHECKING PAYMENT";
	if (flowStatus === "confirmed") return "PAYMENT CONFIRMED";
	return "CONTINUE TO PAYMENT";
}

export default function BuyCoinsCheckoutSummary({
	checkoutOpenBlocked,
	confirmedAmountCents,
	currentCoins,
	error,
	flowStatus,
	hostedUrl,
	isBusy,
	onOpenCheckout,
	onStartCheckout,
	providerStatus,
	selectedPackage,
}: BuyCoinsCheckoutSummaryProps) {
	const creditedTotal = currentCoins + selectedPackage.coins;

	return (
		<aside className="bg-bg2 p-4 pixel-border" aria-label="Order summary">
			<h3 className="mb-4 font-pixel text-xs uppercase tracking-widest text-primary">
				Checkout
			</h3>
			<div className="space-y-0 border-t-3 border-border-pixel font-pixel">
				<div className="flex justify-between gap-4 border-b-3 border-border-pixel py-3 text-[7px] uppercase leading-5 text-cream-dim">
					<span>Package</span>
					<strong className="text-right font-normal text-cream">
						{selectedPackage.name}
					</strong>
				</div>
				<div className="flex justify-between gap-4 border-b-3 border-border-pixel py-3 text-[7px] uppercase leading-5 text-cream-dim">
					<span>Wallet</span>
					<strong className="text-right font-normal text-accent">
						{currentCoins} Coins
					</strong>
				</div>
				<div className="flex justify-between gap-4 border-b-3 border-border-pixel py-3 text-[7px] uppercase leading-5 text-cream-dim">
					<span>Credit</span>
					<strong className="text-right font-normal text-accent">
						+{selectedPackage.coins}
					</strong>
				</div>
				<div className="flex justify-between gap-4 py-3 text-[7px] uppercase leading-5 text-cream-dim">
					<span>After</span>
					<strong className="text-right font-normal text-pixel-white">
						{creditedTotal} Coins
					</strong>
				</div>
				{flowStatus === "confirmed" && confirmedAmountCents !== null && (
					<div className="flex justify-between gap-4 border-t-3 border-border-pixel py-3 text-[7px] uppercase leading-5 text-cream-dim">
						<span>Paid</span>
						<strong className="text-right font-normal text-success">
							{formatCents(confirmedAmountCents)}
						</strong>
					</div>
				)}
			</div>

			<button
				type="button"
				disabled={isBusy || flowStatus === "confirmed"}
				onClick={onStartCheckout}
				className="mt-4 w-full border-3 border-border-light bg-primary px-4 py-3 font-pixel text-[8px] uppercase tracking-wider text-cream shadow-[3px_3px_0_var(--color-bg0)] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
				{getActionLabel(flowStatus)}
			</button>

			{checkoutOpenBlocked && hostedUrl && (
				<button
					type="button"
					onClick={onOpenCheckout}
					className="mt-3 w-full border-3 border-border-pixel bg-bg3 px-4 py-3 font-pixel text-[8px] uppercase tracking-wider text-cream-dim shadow-[3px_3px_0_var(--color-bg0)] hover:text-cream">
					OPEN CHECKOUT
				</button>
			)}

			<BuyCoinsStatusLine
				error={error}
				flowStatus={flowStatus}
				providerStatus={providerStatus}
			/>
		</aside>
	);
}
