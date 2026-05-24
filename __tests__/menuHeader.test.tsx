import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { UserStore } from "@/entities/game/model/types";
import Menu from "@/widgets/home-menu/ui/HomeMenu";

// Mock dependencies used in Menu
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
	usePathname: () => "/",
}));

vi.mock("@/features/authenticate-user/api/firebase", () => ({
	signInWithGoogle: vi.fn(),
	signOutUser: vi.fn(),
}));

vi.mock("@/features/app-state/model/stores", () => ({
	useUser: <T,>(selector: (state: UserStore) => T) =>
		selector({
			user: null,
			setUser: vi.fn(),
			authReady: true,
			setAuthReady: vi.fn(),
		}),
	useSound: () => ({
		bgMute: false,
		bgVolume: 0.5,
		setBgMute: vi.fn(),
		setBgVolume: vi.fn(),
		sfxMute: false,
		sfxVolume: 0.5,
		setSfxMute: vi.fn(),
		setSfxVolume: vi.fn(),
	}),
	useProfile: () => ({
		name: "Test User",
		email: "test@example.com",
		profilePic: "https://example.com/avatar.png",
		setName: vi.fn(),
		setEmail: vi.fn(),
		setProfilePic: vi.fn(),
		resetProfile: vi.fn(),
	}),
	useCoins: () => ({
		coins: 1000,
		setCoins: vi.fn(),
	}),
	useXP: () => ({
		xp: 1000,
		setXP: vi.fn(),
	}),
}));

vi.mock("@/features/show-toast-with-cooldown/model/useToastCooldown", () => ({
	useToastCooldown: () => ({
		canShowToast: () => true,
		triggerToastCooldown: vi.fn(),
		resetCooldown: vi.fn(),
	}),
}));

describe("Menu Header", () => {
	it("renders the menu page header correctly", () => {
		render(<Menu />);
		expect(screen.getByText(/Notakto/i)).toBeInTheDocument();
	});
});
