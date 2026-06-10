import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { UserStore } from "@/features/authenticate-user/model/userStore";

// Required mocks
vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: vi.fn() }),
	usePathname: () => "/",
}));

vi.mock("@/features/authenticate-user/api/firebase", () => ({
	signInWithGoogle: vi.fn(),
	signOutUser: vi.fn(),
}));

vi.mock("@/features/authenticate-user/model/userStore", () => ({
	useUser: <T,>(selector: (state: UserStore) => T) =>
		selector({
			user: null,
			setUser: vi.fn(),
			authReady: true,
			setAuthReady: vi.fn(),
		}),
}));

vi.mock("@/features/show-toast-with-cooldown/model/useToastCooldown", () => ({
	useToastCooldown: () => ({
		canShowToast: () => true,
		triggerToastCooldown: vi.fn(),
		resetCooldown: vi.fn(),
	}),
}));

import Menu from "@/widgets/home-menu/ui/HomeMenu";

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
