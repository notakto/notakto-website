import type {
	BuyCoinPackage,
	BuyCoinsFlowStatus,
	BuyCoinsProviderStatus,
} from "@/features/buy-coins/model/types";
import { formatCents } from "@/shared/lib/formatCents";
import BuyCoinsCheckoutSummaryLabel from "@/widgets/buy-coins-checkout-summary-label/ui/BuyCoinsCheckoutSummaryLabel";
import BuyCoinsStatusLine from "@/widgets/buy-coins-status-line/ui/BuyCoinsStatusLine";
import PixelLoadingIndicator from "@/widgets/pixel-loading-indicator/PixelLoadingIndicator";

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
			<aside className="bg-slate-800 p-10 pixel-border flex items-center justify-center">
				<div className=" text-xs">
					<PixelLoadingIndicator />
				</div>
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
		<aside className="bg-slate-800 p-4 pixel-border" aria-label="Order summary">
			<h3 className="mb-4  text-sm uppercase tracking-widest text-rose-700">
				Checkout
			</h3>
			<div className="space-y-0 border-t-3 border-gray-700 ">
				<BuyCoinsCheckoutSummaryLabel
					title={"Package"}
					content={selectedPackage.packageName}
					textColor={"text-orange-50"}
				/>
				<BuyCoinsCheckoutSummaryLabel
					title={"Wallet"}
					content={`${currentCoins} Coins`}
					textColor={"text-yellow-500"}
				/>
				<BuyCoinsCheckoutSummaryLabel
					title={"Total"}
					content={`${formatCents(selectedPackage.amountCents)}`}
					textColor={"text-yellow-500"}
				/>
				<BuyCoinsCheckoutSummaryLabel
					title={"Credit"}
					content={`${selectedPackage.coins} Coins`}
					textColor={"text-yellow-500"}
				/>
				<BuyCoinsCheckoutSummaryLabel
					title={"After"}
					content={`${creditedTotal} Coins`}
					textColor={"text-orange-50"}
				/>
				{flowStatus === "confirmed" && confirmedAmountCents !== null && (
					<div className="flex justify-between gap-4 border-t-3 border-gray-700 py-3 text-[7px] uppercase leading-5 text-stone-400">
						<span>Paid</span>
						<strong className="text-right font-normal text-green-700">
							{formatCents(confirmedAmountCents)}
						</strong>
					</div>
				)}
			</div>

			<button
				type="button"
				disabled={isBusy || flowStatus === "confirmed"}
				onClick={onStartCheckout}
				className="mt-4 w-full border-3 border-zinc-600 bg-rose-700 px-4 py-3  text-xs uppercase tracking-wider text-stone-300 shadow-[3px_3px_0_var(--color-slate-950)] hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60">
				{getActionLabel(flowStatus)}
			</button>

			{checkoutOpenBlocked && hostedUrl && (
				<button
					type="button"
					onClick={onOpenCheckout}
					className="mt-3 w-full border-3 border-gray-700 bg-slate-800 px-4 py-3  text-[8px] uppercase tracking-wider text-stone-400 shadow-[3px_3px_0_var(--color-slate-950)] hover:text-stone-300">
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
