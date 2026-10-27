import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	INACTIVITY_TIMEOUT_MS,
	useInactivityTimer,
} from "@/features/local-match/model/useInactivityTimer";

describe("useInactivityTimer Acceptance Criteria & Edge Cases", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("accurately detects inactivity and triggers onTimeout after the timeout duration", () => {
		const onTimeout = vi.fn();
		renderHook(() =>
			useInactivityTimer({
				enabled: true,
				timeoutMs: 10000,
				onTimeout,
			}),
		);

		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(9000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(onTimeout).toHaveBeenCalledTimes(1);
	});

	it("does not trigger onTimeout when enabled is false", () => {
		const onTimeout = vi.fn();
		renderHook(() =>
			useInactivityTimer({
				enabled: false,
				timeoutMs: 10000,
				onTimeout,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(20000);
		});

		expect(onTimeout).not.toHaveBeenCalled();
	});

	it("resets inactivity tracking when desktop events (mousemove, keydown, wheel) occur", () => {
		const onTimeout = vi.fn();
		renderHook(() =>
			useInactivityTimer({
				enabled: true,
				timeoutMs: 10000,
				onTimeout,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(6000);
		});

		act(() => {
			window.dispatchEvent(new MouseEvent("mousemove"));
		});

		act(() => {
			vi.advanceTimersByTime(6000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			window.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
		});

		act(() => {
			vi.advanceTimersByTime(6000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			window.dispatchEvent(new Event("wheel"));
		});

		act(() => {
			vi.advanceTimersByTime(9000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(onTimeout).toHaveBeenCalledTimes(1);
	});

	it("resets inactivity tracking when mobile events (touchstart, touchmove, pointerdown) occur", () => {
		const onTimeout = vi.fn();
		renderHook(() =>
			useInactivityTimer({
				enabled: true,
				timeoutMs: 10000,
				onTimeout,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(7000);
		});

		act(() => {
			window.dispatchEvent(new Event("touchstart"));
		});

		act(() => {
			vi.advanceTimersByTime(6000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			window.dispatchEvent(new Event("touchmove"));
		});

		act(() => {
			vi.advanceTimersByTime(6000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			window.dispatchEvent(new Event("pointerdown"));
		});

		act(() => {
			vi.advanceTimersByTime(9999);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(onTimeout).toHaveBeenCalledTimes(1);
	});

	it("handles page visibility changes: immediately triggers timeout if tab was backgrounded beyond timeoutMs", () => {
		const onTimeout = vi.fn();
		renderHook(() =>
			useInactivityTimer({
				enabled: true,
				timeoutMs: 10000,
				onTimeout,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(15000);
		});

		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "visible",
		});

		act(() => {
			document.dispatchEvent(new Event("visibilitychange"));
		});

		expect(onTimeout).toHaveBeenCalled();
	});

	it("has default INACTIVITY_TIMEOUT_MS set to exactly 5 minutes (300,000 ms)", () => {
		expect(INACTIVITY_TIMEOUT_MS).toBe(5 * 60 * 1000);
		expect(INACTIVITY_TIMEOUT_MS).toBe(300000);
	});

	it("triggers modal after 5 minutes of no user interaction by default", () => {
		const onTimeout = vi.fn();
		renderHook(() =>
			useInactivityTimer({
				enabled: true,
				onTimeout,
			}),
		);

		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(299000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(onTimeout).toHaveBeenCalledTimes(1);
	});

	it("resets inactivity tracking when tab becomes visible again before timeoutMs", () => {
		const onTimeout = vi.fn();
		renderHook(() =>
			useInactivityTimer({
				enabled: true,
				timeoutMs: 10000,
				onTimeout,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(6000);
		});

		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			value: "visible",
		});

		act(() => {
			document.dispatchEvent(new Event("visibilitychange"));
		});

		act(() => {
			vi.advanceTimersByTime(6000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(4000);
		});
		expect(onTimeout).toHaveBeenCalledTimes(1);
	});

	it("supports manual reset via resetTimer", () => {
		const onTimeout = vi.fn();
		const { result } = renderHook(() =>
			useInactivityTimer({
				enabled: true,
				timeoutMs: 10000,
				onTimeout,
			}),
		);

		act(() => {
			vi.advanceTimersByTime(8000);
		});

		act(() => {
			result.current.resetTimer();
		});

		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(onTimeout).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(5000);
		});
		expect(onTimeout).toHaveBeenCalledTimes(1);
	});
});
