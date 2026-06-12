import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MockApiClient = {
	post: ReturnType<typeof vi.fn>;
	get: ReturnType<typeof vi.fn>;
};

const mockApiClient: MockApiClient = {
	post: vi.fn(),
	get: vi.fn(),
};
const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

vi.mock("axios", () => ({
	default: {
		create: vi.fn(() => mockApiClient),
		isAxiosError: vi.fn(() => false),
	},
}));

const importBuyCoinsApi = async () => {
	vi.resetModules();
	return import("@/features/buy-coins/api/buyCoinsApis");
};

describe("buy coins API helpers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.NEXT_PUBLIC_API_URL = "https://notakto-solo.example/v1";
	});

	afterEach(() => {
		if (originalApiUrl === undefined) {
			delete process.env.NEXT_PUBLIC_API_URL;
			return;
		}

		process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
	});

	it("creates a charge through the solo backend", async () => {
		mockApiClient.post.mockResolvedValueOnce({
			data: {
				chargeId: "charge-123",
				hostedUrl: "https://nowpayments.io/payment/charge-123",
			},
		});

		const { createCharge } = await importBuyCoinsApi();
		const result = await createCharge("pkg_500", "token-123");

		expect(result).toEqual({
			success: true,
			chargeId: "charge-123",
			hostedUrl: "https://nowpayments.io/payment/charge-123",
		});
		expect(mockApiClient.post).toHaveBeenCalledWith(
			"/create-charge",
			{ packageId: "pkg_500" },
			{
				headers: {
					Authorization: "Bearer token-123",
				},
			},
		);
	});

	it.each([
		"created",
		"pending",
		"confirmed",
		"failed",
	] as const)("parses %s payment status responses", async (status) => {
		mockApiClient.get.mockResolvedValueOnce({
			data: {
				chargeId: "charge-123",
				packageId: "pkg_1200",
				coins: 1200,
				amountCents: 1000,
				status,
				hostedUrl: "https://nowpayments.io/payment/charge-123",
			},
		});

		const { getPaymentStatus } = await importBuyCoinsApi();
		const result = await getPaymentStatus("charge-123", "token-123");

		expect(result).toEqual({
			success: true,
			chargeId: "charge-123",
			packageId: "pkg_1200",
			coins: 1200,
			amountCents: 1000,
			status,
			hostedUrl: "https://nowpayments.io/payment/charge-123",
		});
		expect(mockApiClient.get).toHaveBeenCalledWith("/payment-status", {
			params: { chargeId: "charge-123" },
			headers: {
				Authorization: "Bearer token-123",
			},
		});
	});

	it("returns an invalid response error for malformed create charge data", async () => {
		mockApiClient.post.mockResolvedValueOnce({
			data: {
				chargeId: "charge-123",
				hostedUrl: "not-a-url",
			},
		});

		const { createCharge } = await importBuyCoinsApi();
		const result = await createCharge("pkg_3000", "token-123");

		expect(result).toEqual({
			success: false,
			error: "Invalid response format",
		});
	});

	it("returns a failure when the API URL is missing", async () => {
		delete process.env.NEXT_PUBLIC_API_URL;

		const { createCharge, getPaymentStatus } = await importBuyCoinsApi();

		await expect(createCharge("pkg_500", "token-123")).resolves.toEqual({
			success: false,
			error: "API_URL not defined",
		});
		await expect(getPaymentStatus("charge-123", "token-123")).resolves.toEqual({
			success: false,
			error: "API_URL not defined",
		});
	});
});
