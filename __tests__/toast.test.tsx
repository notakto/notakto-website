import { act, render, screen } from "@testing-library/react";
import { toast } from "react-toastify";
import { afterEach, describe, expect, it } from "vitest";

import { CustomToastContainer } from "@/components/ui/Toasts/CustomToastContainer";

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
});
