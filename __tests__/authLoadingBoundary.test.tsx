import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useUser } from "@/features/authenticate-user/model/userStore";
import AuthLoadingBoundary from "@/widgets/auth-loading-screen/ui/AuthLoadingBoundary";

describe("AuthLoadingBoundary", () => {
	beforeEach(() => {
		useUser.setState({ authReady: true });
	});

	it("blocks the page while authentication is initializing", () => {
		useUser.setState({ authReady: false });

		const { container } = render(
			<AuthLoadingBoundary>
				<button type="button">Play</button>
			</AuthLoadingBoundary>,
		);

		expect(screen.getByRole("status", { name: "Signing in" })).toBeVisible();
		expect(screen.getByText("Signing in...")).toBeVisible();
		expect(container.firstElementChild).toHaveAttribute("inert");
		expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
	});

	it("renders the page normally when authentication is ready", () => {
		const { container } = render(
			<AuthLoadingBoundary>
				<button type="button">Play</button>
			</AuthLoadingBoundary>,
		);

		expect(screen.queryByRole("status", { name: "Signing in" })).toBeNull();
		expect(container.firstElementChild).not.toHaveAttribute("inert");
		expect(container.firstElementChild).toHaveAttribute("aria-busy", "false");
	});
});
