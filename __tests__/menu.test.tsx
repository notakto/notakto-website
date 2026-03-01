import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { UserStore } from "@/services/types";

// Required mocks
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
	usePathname: () => "/",
}));

vi.mock("@/services/firebase", () => ({
	signInWithGoogle: vi.fn(),
	signOutUser: vi.fn(),
}));

vi.mock("@/services/store", () => ({
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

vi.mock("@/components/hooks/useToastCooldown", () => ({
	useToastCooldown: () => ({
		canShowToast: () => true,
		triggerToastCooldown: vi.fn(),
		resetCooldown: vi.fn(),
	}),
}));

import Menu from "@/app/Menu";

describe("Menu game modes", () => {
	it("renders all expected game mode cards", () => {
		render(<Menu />);

		expect(screen.getByText("VS PLAYER")).toBeInTheDocument();
		expect(screen.getByText("VS CPU")).toBeInTheDocument();
		expect(screen.getByText("LIVE MATCH")).toBeInTheDocument();
	});

	it("renders the title", () => {
		render(<Menu />);

		expect(screen.getByText("NOTAKTO")).toBeInTheDocument();
	});
});
