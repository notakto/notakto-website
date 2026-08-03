import type {
	CreateChargeResponse,
	PaymentStatus,
	PaymentStatusResponse,
} from "@/features/buy-coins/api/schema";

export interface BuyCoinsErrorResponse {
	success: false;
	error: string;
}

export type CreateChargeResult =
	| ({ success: true } & CreateChargeResponse)
	| BuyCoinsErrorResponse;

export type PaymentStatusResult =
	| ({ success: true } & PaymentStatusResponse)
	| BuyCoinsErrorResponse;

export interface BuyCoinPackage {
	packageId: string;
	packageName: string;
	coins: number;
	visualCoins: 2 | 3 | 4;
	amountCents: number;
}

export type BuyCoinsFlowStatus =
	| "idle"
	| "creating"
	| "polling"
	| "confirmed"
	| "failed"
	| "timeout";

export type BuyCoinsProviderStatus = PaymentStatus | null;
