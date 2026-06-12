import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { UserStore } from "@/entities/game/model/types";
import { useGlobalModal } from "@/features/manage-global-modal/model/globalModalStore";
import GlobalModals from "@/widgets/global-modal-layer/ui/GlobalModalLayer";
import MobileBottomNav from "@/widgets/mobile-bottom-nav/ui/MobileBottomNav";
import SidebarNavigation from "@/widgets/sidebar-navigation/ui/SidebarNavigation";

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

vi.mock("@/features/app-state/model/stores", () => ({
	useUser: <T,>(selector: (state: UserStore) => T) =>
		selector({
			authReady: true,
			setAuthReady: vi.fn(),
			setUser: vi.fn(),
			user: null,
		}),
	useCoins: <T,>(
		selector: (state: { coins: number; setCoins: () => void }) => T,
	) =>
		selector({
			coins: 0,
			setCoins: vi.fn(),
		}),
	useXP: <T,>(selector: (state: { XP: number; setXP: () => void }) => T) =>
		selector({
			XP: 0,
			setXP: vi.fn(),
		}),
	useProfile: () => ({
		email: "empty@empty.empty",
		name: "player",
		pic: "empty.empty",
		setEmail: vi.fn(),
		setName: vi.fn(),
		setPic: vi.fn(),
	}),
	useSound: () => ({
		bgMute: true,
		bgVolume: 0.3,
		setBgMute: vi.fn(),
		setBgVolume: vi.fn(),
		setSfxMute: vi.fn(),
		setSfxVolume: vi.fn(),
		sfxMute: false,
		sfxVolume: 0.5,
	}),
}));

vi.mock("@/features/authenticate-user/api/firebase", () => ({
	signInWithGoogle: vi.fn(),
	signOutUser: vi.fn(),
}));

vi.mock("@/features/backend-game/api/gameApis", () => ({
	getWallet: vi.fn(),
}));

vi.mock("@/features/buy-coins/api/buyCoinsApis", () => ({
	createCharge: vi.fn(),
	getPaymentStatus: vi.fn(),
}));

describe("Buy coins navigation", () => {
	afterEach(() => {
		act(() => {
			useGlobalModal.getState().closeModal();
		});
	});

	it("opens the buy coins modal from the desktop sidebar", async () => {
		render(
			<>
				<SidebarNavigation />
				<GlobalModals />
			</>,
		);

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: /BUY COINS/i }));
		});

		expect(
			screen.getByRole("heading", { name: "Buy Coins" }),
		).toBeInTheDocument();
		expect(screen.getByText("SIGN IN REQUIRED")).toBeInTheDocument();
	});

	it("shows the buy coins action in the mobile More menu", () => {
		const openModal = vi.fn();

		render(
			<MobileBottomNav
				pathname="/"
				openModal={openModal}
				navItems={[
					{ href: "/downloads", label: "DOWNLOADS", icon: "=" },
					{
						href: "https://github.com/notakto/notakto-website/issues",
						label: "BUG REPORT",
						icon: "!",
						external: true,
					},
				]}
				walletItems={[{ label: "BUY COINS", icon: "$", modal: "buyCoins" }]}
				modalItems={[]}
				gamePages={[]}
				gameButtons={{}}
			/>,
		);

		act(() => {
			fireEvent.click(screen.getByRole("button", { name: /MORE/i }));
		});
		act(() => {
			fireEvent.click(screen.getByRole("button", { name: /BUY COINS/i }));
		});

		expect(openModal).toHaveBeenCalledWith("buyCoins");
	});
});
