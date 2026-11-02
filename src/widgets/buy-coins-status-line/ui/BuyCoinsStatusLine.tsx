import clsx from "clsx";
import type {
	BuyCoinsFlowStatus,
	BuyCoinsProviderStatus,
} from "@/features/buy-coins/model/types";

interface BuyCoinsStatusLineProps {
	error: string | null;
	flowStatus: BuyCoinsFlowStatus;
	providerStatus: BuyCoinsProviderStatus;
}

function getStatusLabel(
	flowStatus: BuyCoinsFlowStatus,
	providerStatus: BuyCoinsProviderStatus,
) {
	if (flowStatus === "idle") return "PAYMENT STATUS: READY";
	if (flowStatus === "creating") return "PAYMENT STATUS: CREATING";
	if (flowStatus === "polling") {
		return `PAYMENT STATUS: ${(providerStatus ?? "created").toUpperCase()}`;
	}
	if (flowStatus === "confirmed") return "PAYMENT STATUS: CONFIRMED";
	if (flowStatus === "timeout") return "PAYMENT STATUS: TIMED OUT";
	return "PAYMENT STATUS: FAILED";
}

export default function BuyCoinsStatusLine({
	error,
	flowStatus,
	providerStatus,
}: BuyCoinsStatusLineProps) {
	const isSuccess = !error && flowStatus === "confirmed";
	const isFailure =
		!!error || flowStatus === "failed" || flowStatus === "timeout";

	return (
		<div
			className={clsx(
				"mt-4 flex items-start gap-2  text-[8px] uppercase leading-5",
				isSuccess && "text-green-700",
				isFailure && "text-rose-700",
				!isSuccess && !isFailure && "text-yellow-600",
			)}>
			<span
				className={clsx(
					"mt-1 h-2.5 w-2.5 shrink-0 shadow-[2px_2px_0_var(--color-slate-950)]",
					isSuccess && "bg-green-700",
					isFailure && "bg-rose-700",
					!isSuccess && !isFailure && "bg-yellow-600",
				)}
			/>
			<span>{error ?? getStatusLabel(flowStatus, providerStatus)}</span>
		</div>
	);
}
