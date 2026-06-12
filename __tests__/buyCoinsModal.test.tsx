import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import type { User } from "firebase/auth";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type {
	CoinStore,
	UserStore,
	XPStore,
} from "@/entities/game/model/types";
import BuyCoinsModal from "@/widgets/buy-coins-modal/ui/BuyCoinsModal";

const mocks = vi.hoisted(() => ({
	createCharge: vi.fn(),
	getPaymentStatus: vi.fn(),
	getWallet: vi.fn(),
	getIdToken: vi.fn(),
	setCoins: vi.fn(),
	setXP: vi.fn(),
	signInWithGoogle: vi.fn(),
	state: {
		authReady: true,
		coins: 1000,
		user: null as User | null,
		xp: 40,
	},
}));

vi.mock("@/features/app-state/model/stores", () => ({
	useCoins: <T,>(selector: (state: CoinStore) => T) =>
		selector({
			coins: mocks.state.coins,
			optimisticAddCoins: vi.fn(),
			setCoins: mocks.setCoins,
		}),
	useUser: <T,>(selector: (state: UserStore) => T) =>
		selector({
			authReady: mocks.state.authReady,
			setAuthReady: vi.fn(),
			setUser: vi.fn(),
			user: mocks.state.user,
		}),
	useXP: <T,>(selector: (state: XPStore) => T) =>
		selector({
			XP: mocks.state.xp,
			optimisticAddXP: vi.fn(),
			setXP: mocks.setXP,
		}),
}));

vi.mock("@/features/authenticate-user/api/firebase", () => ({
	signInWithGoogle: mocks.signInWithGoogle,
}));

vi.mock("@/features/backend-game/api/gameApis", () => ({
	getWallet: mocks.getWallet,
}));

vi.mock("@/features/buy-coins/api/buyCoinsApis", () => ({
	createCharge: mocks.createCharge,
	getPaymentStatus: mocks.getPaymentStatus,
}));

function setSignedInUser() {
	mocks.state.user = {
		getIdToken: mocks.getIdToken,
	} as unknown as User;
}

async function flushAsyncWork() {
	await act(async () => {
		await Promise.resolve();
		await Promise.resolve();
		await Promise.resolve();
	});
}

describe("BuyCoinsModal", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mocks.state.authReady = true;
		mocks.state.coins = 1000;
		mocks.state.user = null;
		mocks.state.xp = 40;
		mocks.getIdToken.mockResolvedValue("token-123");
	});

	afterEach(() => {
		cleanup();
		vi.clearAllTimers();
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("shows a sign-in prompt for signed-out users", () => {
		render(<BuyCoinsModal visible={true} />);

		expect(screen.getByText("SIGN IN REQUIRED")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "SIGN IN" }));

		expect(mocks.signInWithGoogle).toHaveBeenCalledTimes(1);
	});

	it("renders the three packages and updates the summary selection", () => {
		setSignedInUser();
		render(<BuyCoinsModal visible={true} />);

		expect(
			screen.getByRole("button", { name: /Starter Pack/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Tactical Pack/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Champion Pack/i }),
		).toBeInTheDocument();

		const summary = screen.getByRole("complementary", {
			name: "Order summary",
		});
		expect(within(summary).getByText("Tactical Pack")).toBeInTheDocument();
		expect(within(summary).getByText("+1200")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: /Champion Pack/i }));

		expect(within(summary).getByText("Champion Pack")).toBeInTheDocument();
		expect(within(summary).getByText("+3000")).toBeInTheDocument();
	});

	it("opens checkout, polls status, and refreshes the wallet when confirmed", async () => {
		vi.useFakeTimers();
		setSignedInUser();
		vi.spyOn(window, "open").mockImplementation(() => ({}) as Window);
		mocks.createCharge.mockResolvedValueOnce({
			success: true,
			chargeId: "charge-123",
			hostedUrl: "https://pay.example/charge-123",
		});
		mocks.getPaymentStatus
			.mockResolvedValueOnce({
				success: true,
				amountCents: 1000,
				chargeId: "charge-123",
				hostedUrl: "https://pay.example/charge-123",
				packageId: "pkg_1200",
				coins: 1200,
				status: "pending",
			})
			.mockResolvedValueOnce({
				success: true,
				amountCents: 1000,
				chargeId: "charge-123",
				hostedUrl: "https://pay.example/charge-123",
				packageId: "pkg_1200",
				coins: 1200,
				status: "confirmed",
			});
		mocks.getWallet.mockResolvedValueOnce({
			success: true,
			coins: 2200,
			xp: 60,
		});

		render(<BuyCoinsModal visible={true} />);

		fireEvent.click(
			screen.getByRole("button", { name: "CONTINUE TO PAYMENT" }),
		);
		await flushAsyncWork();

		expect(mocks.createCharge).toHaveBeenCalledWith("pkg_1200", "token-123");
		expect(window.open).toHaveBeenCalledWith(
			"https://pay.example/charge-123",
			"_blank",
			"noopener,noreferrer",
		);
		expect(mocks.getPaymentStatus).toHaveBeenCalledTimes(1);

		await act(async () => {
			vi.advanceTimersByTime(5000);
		});
		await flushAsyncWork();

		expect(mocks.getPaymentStatus).toHaveBeenCalledTimes(2);
		expect(mocks.setCoins).toHaveBeenCalledWith(2200);
		expect(mocks.setXP).toHaveBeenCalledWith(60);
		expect(screen.getByText("PAYMENT STATUS: CONFIRMED")).toBeInTheDocument();
	});

	it("shows the fallback checkout action when popup opening is blocked", async () => {
		vi.useFakeTimers();
		setSignedInUser();
		vi.spyOn(window, "open").mockImplementation(() => null);
		mocks.createCharge.mockResolvedValueOnce({
			success: true,
			chargeId: "charge-123",
			hostedUrl: "https://pay.example/charge-123",
		});
		mocks.getPaymentStatus.mockResolvedValue({
			success: true,
			amountCents: 1000,
			chargeId: "charge-123",
			hostedUrl: "https://pay.example/charge-123",
			packageId: "pkg_1200",
			coins: 1200,
			status: "pending",
		});

		render(<BuyCoinsModal visible={true} />);

		fireEvent.click(
			screen.getByRole("button", { name: "CONTINUE TO PAYMENT" }),
		);
		await flushAsyncWork();

		expect(
			screen.getByRole("button", { name: "OPEN CHECKOUT" }),
		).toBeInTheDocument();
	});

	it("shows a failed state when the payment provider reports failure", async () => {
		vi.useFakeTimers();
		setSignedInUser();
		vi.spyOn(window, "open").mockImplementation(() => ({}) as Window);
		mocks.createCharge.mockResolvedValueOnce({
			success: true,
			chargeId: "charge-123",
			hostedUrl: "https://pay.example/charge-123",
		});
		mocks.getPaymentStatus.mockResolvedValueOnce({
			success: true,
			amountCents: 1000,
			chargeId: "charge-123",
			hostedUrl: "https://pay.example/charge-123",
			packageId: "pkg_1200",
			coins: 1200,
			status: "failed",
		});

		render(<BuyCoinsModal visible={true} />);

		fireEvent.click(
			screen.getByRole("button", { name: "CONTINUE TO PAYMENT" }),
		);
		await flushAsyncWork();

		expect(screen.getByText("Payment failed")).toBeInTheDocument();
		expect(mocks.getWallet).not.toHaveBeenCalled();
	});
});
