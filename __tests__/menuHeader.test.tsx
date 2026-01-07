import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Menu from "@/app/Menu";
import type { UserStore } from "@/services/types";

// Mock dependencies used in Menu
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
		selector({ user: null, setUser: vi.fn() }),
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

describe("Menu Header", () => {
	it("renders the menu page header correctly", () => {
		render(<Menu />);
		expect(screen.getByText(/Notakto/i)).toBeInTheDocument();
	});
});
