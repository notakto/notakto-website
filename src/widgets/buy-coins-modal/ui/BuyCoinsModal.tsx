"use client";

import { useBuyCoinsFlow } from "@/features/buy-coins/model/useBuyCoinsFlow";
import BuyCoinsCheckoutSummary from "@/widgets/buy-coins-checkout-summary/ui/BuyCoinsCheckoutSummary";
import BuyCoinsLoginPrompt from "@/widgets/buy-coins-login-prompt/ui/BuyCoinsLoginPrompt";
import BuyCoinsPackageCard from "@/widgets/buy-coins-package-card/ui/BuyCoinsPackageCard";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";

interface BuyCoinsModalProps {
	visible: boolean;
	onClose?: () => void;
}

function BuyCoinsModalContent({ onClose }: { onClose?: () => void }) {
	const buyCoins = useBuyCoinsFlow();

	return (
		<ModalOverlay>
			<div className="max-h-[92vh] w-[95%] max-w-5xl overflow-y-auto bg-gray-800 p-4 md:p-6 pixel-border">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div>
						<h2 className=" text-sm uppercase tracking-widest text-yellow-500 md:text-base">
							Buy Coins
						</h2>
						<p className="mt-2  text-[9px] uppercase leading-5 text-stone-400">
							Wallet top up
						</p>
					</div>
					<button
						type="button"
						aria-label="Close buy coins"
						onClick={onClose}
						className="h-10 w-10 shrink-0 border-3 border-gray-700 bg-slate-800  text-[10px] text-stone-400 shadow-[3px_3px_0_var(--color-slate-950)] hover:text-stone-300">
						X
					</button>
				</div>

				{buyCoins.user ? (
					<div className="flex flex-col">
						<div>
							<div className="mb-4 grid gap-3 sm:grid-cols-3">
								{buyCoins.packages.map((coinPackage) => (
									<BuyCoinsPackageCard
										key={coinPackage.packageId}
										coinPackage={coinPackage}
										disabled={buyCoins.isBusy}
										selected={
											coinPackage.packageId === buyCoins.selectedPackageId
										}
										onSelect={buyCoins.selectPackage}
									/>
								))}
							</div>
						</div>

						<BuyCoinsCheckoutSummary
							checkoutOpenBlocked={buyCoins.checkoutOpenBlocked}
							confirmedAmountCents={buyCoins.confirmedAmountCents}
							currentCoins={buyCoins.currentCoins}
							error={buyCoins.error}
							flowStatus={buyCoins.flowStatus}
							hostedUrl={buyCoins.hostedUrl}
							isBusy={buyCoins.isBusy}
							onOpenCheckout={() => buyCoins.openHostedCheckout()}
							onStartCheckout={buyCoins.startCheckout}
							providerStatus={buyCoins.providerStatus}
							selectedPackage={buyCoins.selectedPackage}
							packagesError={buyCoins.packagesError}
							packagesLoading={buyCoins.packagesLoading}
							retryFetchPackages={buyCoins.retryFetchPackages}
							packages={buyCoins.packages}
						/>
					</div>
				) : (
					<BuyCoinsLoginPrompt
						authReady={buyCoins.authReady}
						error={buyCoins.error}
						onSignIn={buyCoins.signIn}
					/>
				)}
			</div>
		</ModalOverlay>
	);
}

export default function BuyCoinsModal({
	visible,
	onClose,
}: BuyCoinsModalProps) {
	if (!visible) return null;

	return <BuyCoinsModalContent onClose={onClose} />;
}
