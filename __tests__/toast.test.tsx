import { act, render, screen } from "@testing-library/react";
import { toast } from "react-toastify";
import { afterEach, describe, expect, it, vi } from "vitest";

// Mock font for next/font/google
vi.mock("next/font/google", () => ({
	VT323: (_opts: unknown) => ({ className: "vt323-class" }),
}));

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

		const expected = [
			"vt323-class",
			"bg-black",
			"text-white",
			"relative",
			"text-center",
		];
		for (const cls of expected) expect(toastWrapper?.className).toContain(cls);

		expect(screen.queryAllByText("Hello Toast Test")).toHaveLength(1);
	});
});
