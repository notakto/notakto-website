import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { TOAST_DURATION } from "@/constants/toast";
import { useToastStore } from "@/services/store";
export function useRaiseCustomToast() {
  const { canShowToast, triggerToastCooldown, resetCooldown } =
    useToastCooldown(TOAST_DURATION);
  const { addToast } = useToastStore();

  const raiseToast = (content: string, toastId: string) => {
    if (canShowToast()) {
      addToast(content, toastId);
      triggerToastCooldown();
    }
  };

  return { raiseToast, resetCooldown };
}
