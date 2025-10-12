import { useCallback, useRef } from "react";
import { TOAST_DURATION } from "@/constants/toast";

const EARLY_RESET_MS = 400;

export function useToastCooldown(cooldown: number = TOAST_DURATION) {
	const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isOnCooldown = useRef(false);

	const canShowToast = useCallback(() => !isOnCooldown.current, []);

	const triggerToastCooldown = useCallback(() => {
		isOnCooldown.current = true;

		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}

		cooldownTimer.current = setTimeout(
			() => {
				isOnCooldown.current = false;
				cooldownTimer.current = null;
			},
			Math.max(0, cooldown - EARLY_RESET_MS),
		);
	}, [cooldown]);

	const resetCooldown = useCallback(() => {
		if (cooldownTimer.current) {
			clearTimeout(cooldownTimer.current);
		}
		cooldownTimer.current = null;
		isOnCooldown.current = false;
	}, []);

	return { canShowToast, triggerToastCooldown, resetCooldown };
}
