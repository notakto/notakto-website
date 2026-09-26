import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useUser } from "@/features/authenticate-user/model/userStore";
import AuthLoadingScreen from "@/widgets/auth-loading-screen/ui/AuthLoadingScreen";

describe("AuthLoadingScreen", () => {
	afterEach(() => {
		act(() => {
			useUser.setState({ authReady: false });
		});
	});

	it("shows a blocking account loader while authentication is unresolved", () => {
		act(() => {
			useUser.setState({ authReady: false });
		});

		render(<AuthLoadingScreen />);

		expect(
			screen.getByRole("status", { name: "Loading account" }),
		).toBeInTheDocument();
		expect(screen.getByText("LOADING ACCOUNT")).toBeInTheDocument();
	});

	it("renders nothing after authentication resolves", () => {
		act(() => {
			useUser.setState({ authReady: true });
		});

		const { container } = render(<AuthLoadingScreen />);

		expect(container).toBeEmptyDOMElement();
	});
});
