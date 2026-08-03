import type {
	BuyCoinPackage,
	BuyCoinsFlowStatus,
	BuyCoinsProviderStatus,
} from "@/features/buy-coins/model/types";
import { formatCents } from "@/shared/lib/formatCents";
import BuyCoinsCheckoutSummaryLabel from "@/widgets/buy-coins-checkout-summary-label/ui/BuyCoinsCheckoutSummaryLabel";
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
	selectedPackage: BuyCoinPackage | undefined;
	packagesError: string | null;
	packagesLoading: boolean;
	retryFetchPackages: () => void;
	packages: BuyCoinPackage[] | undefined;
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
	packagesError,
	packagesLoading,
	retryFetchPackages,
	packages,
}: BuyCoinsCheckoutSummaryProps) {
	if (packagesLoading) {
		return (
			<aside className="bg-bg2 p-10 pixel-border">
				<p className="font-pixel text-xs">
					{/* Need to add the custom loader later... */}
					Loading packages...
				</p>
			</aside>
		);
	}

	if (packagesError) {
		return (
			<div className="flex items-center justify-center flex-col gap-5">
				<p className="text-sm">{packagesError}</p>
				<button
					className="pixel-border px-4 py-2 font-semibold cursor-pointer hover:bg-white/10 active:translate-y-px transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
					type="button"
					onClick={retryFetchPackages}>
					Retry
				</button>
			</div>
		);
	}

	if (packages && packages.length === 0) {
		return <p className="text-sm">No coin packages are available.</p>;
	}

	if (!selectedPackage) {
		return null;
	}

	const creditedTotal = currentCoins + selectedPackage.coins;

	return (
		<aside className="bg-bg2 p-4 pixel-border" aria-label="Order summary">
			<h3 className="mb-4 font-pixel text-sm uppercase tracking-widest text-primary">
				Checkout
			</h3>
			<div className="space-y-0 border-t-3 border-border-pixel font-pixel">
				<BuyCoinsCheckoutSummaryLabel
					title={"Package"}
					content={selectedPackage.packageName}
					textColor={"text-pixel-white"}
				/>
				<BuyCoinsCheckoutSummaryLabel
					title={"Wallet"}
					content={`${currentCoins} Coins`}
					textColor={"text-accent"}
				/>
				<BuyCoinsCheckoutSummaryLabel
					title={"Total"}
					content={`${formatCents(selectedPackage.amountCents)}`}
					textColor={"text-accent"}
				/>
				<BuyCoinsCheckoutSummaryLabel
					title={"Credit"}
					content={`${selectedPackage.coins} Coins`}
					textColor={"text-accent"}
				/>
				<BuyCoinsCheckoutSummaryLabel
					title={"After"}
					content={`${creditedTotal} Coins`}
					textColor={"text-pixel-white"}
				/>
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
				className="mt-4 w-full border-3 border-border-light bg-primary px-4 py-3 font-pixel text-xs uppercase tracking-wider text-cream shadow-[3px_3px_0_var(--color-bg0)] hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60">
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
