import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { tutStore, userStore } from "@/services/store";

// Required mocks
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/services/firebase", () => ({
	signInWithGoogle: vi.fn(),
	signOutUser: vi.fn(),
}));

vi.mock("@/services/store", () => ({
	useUser: <T,>(selector: (state: userStore) => T) =>
		selector({ user: null, setUser: vi.fn() }),
	useTut: <T,>(selector: (state: tutStore) => T) =>
		selector({ showTut: false, setShowTut: vi.fn() }),
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
}));

vi.mock("@/components/hooks/useToastCooldown", () => ({
	useToastCooldown: () => ({
		canShowToast: () => true,
		triggerToastCooldown: vi.fn(),
		resetCooldown: vi.fn(),
	}),
}));

import Menu from "@/app/Menu";

describe("Menu buttons", () => {
	it("renders all expected menu buttons", () => {
		render(<Menu />);

		expect(
			screen.getByRole("button", { name: /play vs player/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /play vs computer/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /live match/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /tutorial/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /sign in|sign out/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /adjust sound/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /keyboard shortcuts/i }),
		).toBeInTheDocument();
	});
});
