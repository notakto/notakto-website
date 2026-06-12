import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WalletBadge from "@/widgets/wallet-badge/ui/WalletBadge";

describe("WalletBadge", () => {
	it("calls the buy coins action from the plus button", () => {
		const onBuyCoins = vi.fn();

		render(<WalletBadge coins={1200} xp={40} onBuyCoins={onBuyCoins} />);

		fireEvent.click(screen.getByRole("button", { name: "Buy coins" }));

		expect(onBuyCoins).toHaveBeenCalledTimes(1);
	});

	it("does not render the buy coins button without an action", () => {
		render(<WalletBadge coins={1200} xp={40} />);

		expect(screen.queryByRole("button", { name: "Buy coins" })).toBeNull();
	});
});
