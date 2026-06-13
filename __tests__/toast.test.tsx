import { act, render, screen } from "@testing-library/react";
import { toast } from "react-toastify";
import { afterEach, describe, expect, it } from "vitest";
import { CustomToastContainer } from "@/widgets/toast-surface/ui/ToastSurface";

describe("Toast Tests", () => {
	afterEach(() => {
		act(() => {
			toast.dismiss();
		});
	});

	it("T1 : shows a toast with correct text and styling when triggered", async () => {
		render(<CustomToastContainer />);
		act(() => {
			toast("Hello Toast Test");
		});
		const toastText = await screen.findByText("Hello Toast Test");
		expect(toastText).toBeInTheDocument();
		const toastWrapper =
			toastText.closest(".Toastify__toast") ?? toastText.closest("div");
		expect(toastWrapper).toBeTruthy();
		const expected = ["bg-panel", "text-cream", "relative", "text-center"];
		for (const cls of expected) expect(toastWrapper?.className).toContain(cls);
		expect(screen.queryAllByText("Hello Toast Test")).toHaveLength(1);
	});

	it("two distinct toasts appear and stack properly when triggered in quick succession", async () => {
		render(<CustomToastContainer />);

		act(() => {
			toast.error("Error one: action A failed");
			toast.error("Error two: action B failed");
		});

		// Wait for both toasts to appear in the DOM (works with portals)
		const toastOne = await screen.findByText("Error one: action A failed");
		const toastTwo = await screen.findByText("Error two: action B failed");
		expect(toastOne).toBeInTheDocument();
		expect(toastTwo).toBeInTheDocument();

		// role="alert" is assigned by react-toastify to every toast
		const allToasts = await screen.findAllByRole("alert");
		expect(allToasts).toHaveLength(2);

		// Neither toast contains the other — stacked as siblings, not nested
		const [first, second] = allToasts;
		expect(first).not.toContainElement(second as HTMLElement);
		expect(second).not.toContainElement(first as HTMLElement);

		// Truly distinct — different text content
		expect(first.textContent).not.toBe(second.textContent);
	});
});
