import type {
	CreateChargeResponse,
	PaymentStatus,
	PaymentStatusResponse,
} from "@/features/buy-coins/api/schema";

interface BuyCoinsErrorResponse {
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
	id: string;
	name: string;
	coins: number;
	visualCoins: 2 | 3 | 4;
}

export type BuyCoinsFlowStatus =
	| "idle"
	| "creating"
	| "polling"
	| "confirmed"
	| "failed"
	| "timeout";

export type BuyCoinsProviderStatus = PaymentStatus | null;
