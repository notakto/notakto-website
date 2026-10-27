"use client";

import { useCallback, useEffect, useRef } from "react";

export const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

interface UseInactivityTimerOptions {
	enabled: boolean;
	timeoutMs?: number;
	onTimeout: () => void;
}

const ACTIVITY_EVENTS = [
	"mousemove",
	"mousedown",
	"keydown",
	"touchstart",
	"touchmove",
	"touchend",
	"pointerdown",
	"wheel",
	"scroll",
] as const;

export function useInactivityTimer({
	enabled,
	timeoutMs = INACTIVITY_TIMEOUT_MS,
	onTimeout,
}: UseInactivityTimerOptions) {
	const lastActivityRef = useRef(Date.now());
	const onTimeoutRef = useRef(onTimeout);
	onTimeoutRef.current = onTimeout;

	const resetTimer = useCallback(() => {
		lastActivityRef.current = Date.now();
	}, []);

	useEffect(() => {
		if (!enabled) return;

		resetTimer();

		let lastThrottle = 0;
		const handleActivity = () => {
			const now = Date.now();
			if (now - lastThrottle > 200) {
				lastThrottle = now;
				lastActivityRef.current = now;
			}
		};

		for (const event of ACTIVITY_EVENTS) {
			window.addEventListener(event, handleActivity, {
				capture: true,
				passive: true,
			});
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") {
				if (Date.now() - lastActivityRef.current >= timeoutMs) {
					onTimeoutRef.current();
				} else {
					lastActivityRef.current = Date.now();
				}
			}
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);

		const interval = setInterval(() => {
			if (Date.now() - lastActivityRef.current >= timeoutMs) {
				onTimeoutRef.current();
			}
		}, 1000);

		return () => {
			for (const event of ACTIVITY_EVENTS) {
				window.removeEventListener(event, handleActivity, true);
			}
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			clearInterval(interval);
		};
	}, [enabled, timeoutMs, resetTimer]);

	return { resetTimer };
}
