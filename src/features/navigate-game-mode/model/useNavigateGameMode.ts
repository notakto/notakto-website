"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser } from "@/features/app-state/model/stores";
import {
	TOAST_DURATION,
	TOAST_IDS,
} from "@/features/show-toast-with-cooldown/model/toast";
import { useToastCooldown } from "@/features/show-toast-with-cooldown/model/useToastCooldown";

export function useNavigateGameMode() {
	const user = useUser((state) => state.user);
	const router = useRouter();
	const { canShowToast, resetCooldown } = useToastCooldown(TOAST_DURATION);

	return (mode: string, requiresAuth: boolean) => {
		if (requiresAuth && !user) {
			if (canShowToast()) {
				toast("Please sign in!", {
					toastId: TOAST_IDS.User.SignInError,
					autoClose: TOAST_DURATION,
					onClose: resetCooldown,
				});
			}
			return;
		}
		router.push(`/${mode}`);
	};
}
