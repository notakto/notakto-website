import { TOAST_DURATION } from "@/constants/toast";
import { useRef, useCallback } from "react";

export function useToastCooldown(cooldown: number = TOAST_DURATION){
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isOnCooldown = useRef(false);

  const canShowToast = useCallback(() => !isOnCooldown.current, []);

  const triggerToastCooldown = useCallback(() => {
    isOnCooldown.current = true;

    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      isOnCooldown.current = false;
    }, cooldown);
  }, [cooldown]);

  const resetCooldown = useCallback(() => {
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    isOnCooldown.current = false;
  }, []);

  return { canShowToast, triggerToastCooldown, resetCooldown };
}