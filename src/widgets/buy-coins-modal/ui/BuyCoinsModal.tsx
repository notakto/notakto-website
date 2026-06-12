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
			<div className="max-h-[92vh] w-[95%] max-w-5xl overflow-y-auto bg-panel p-4 md:p-6 pixel-border">
				<div className="mb-5 flex items-start justify-between gap-4">
					<div>
						<h2 className="font-pixel text-sm uppercase tracking-widest text-accent md:text-base">
							Buy Coins
						</h2>
						<p className="mt-2 font-pixel text-[8px] uppercase leading-5 text-cream-dim">
							Wallet top up
						</p>
					</div>
					<button
						type="button"
						aria-label="Close buy coins"
						onClick={onClose}
						className="h-10 w-10 shrink-0 border-3 border-border-pixel bg-bg2 font-pixel text-[10px] text-cream-dim shadow-[3px_3px_0_var(--color-bg0)] hover:text-cream">
						X
					</button>
				</div>

				{buyCoins.user ? (
					<div className="grid gap-5 lg:grid-cols-[1fr_290px]">
						<div>
							<div className="mb-4 grid gap-3 sm:grid-cols-3">
								{buyCoins.packages.map((coinPackage) => (
									<BuyCoinsPackageCard
										key={coinPackage.id}
										coinPackage={coinPackage}
										disabled={buyCoins.isBusy}
										selected={coinPackage.id === buyCoins.selectedPackageId}
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
