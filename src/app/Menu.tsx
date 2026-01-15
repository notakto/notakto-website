"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import { useShortcut } from "@/components/hooks/useShortcut";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { MenuButton } from "@/components/ui/Buttons/MenuButton";
import MenuButtonContainer from "@/components/ui/Containers/Menu/MenuButtonContainer";
import MenuContainer from "@/components/ui/Containers/Menu/MenuContainer";
import { MenuTitle } from "@/components/ui/Title/MenuTitle";
import { TOAST_DURATION, TOAST_IDS } from "@/constants/toast";
import { useRouter } from "@/i18n/routing";
import ShortcutModal from "@/modals/ShortcutModal";
import SoundConfigModal from "@/modals/SoundConfigModal";
import TutorialModal from "@/modals/TutorialModal";
import { signInWithGoogle, signOutUser } from "@/services/firebase";
import { useUser } from "@/services/store";
import type { MenuModalType } from "@/services/types";

const Menu = () => {
	const user = useUser((state) => state.user);
	const t = useTranslations("Menu");
	const router = useRouter();
	const { canShowToast, resetCooldown } = useToastCooldown(TOAST_DURATION);
	const [activeModal, setActiveModal] = useState<MenuModalType>(null);

	useShortcut({
		escape: () => setActiveModal(null),
		s: () =>
			setActiveModal((prev) => (prev === "soundConfig" ? null : "soundConfig")),
		q: () =>
			setActiveModal((prev) => (prev === "shortcut" ? null : "shortcut")),
		t: () =>
			setActiveModal((prev) => (prev === "tutorial" ? null : "tutorial")),
	});

	const handleSignIn = async () => {
		try {
			await signInWithGoogle();

			toast.dismiss(TOAST_IDS.User.SignInError);
			resetCooldown();
		} catch (error) {
			console.error("Sign in error:", error);
		}
	};

	const handleSignOut = async () => {
		try {
			await signOutUser();
		} catch (error) {
			console.error("Sign out error:", error);
		}
	};

	const startGame = (mode: string) => {
		if ((mode === "liveMatch" || mode === "vsComputer") && !user) {
			if (canShowToast()) {
				toast(t("toast_sign_in"), {
					toastId: TOAST_IDS.User.SignInError,
					autoClose: TOAST_DURATION,
					onClose: resetCooldown, // reset cooldown immediately when closed
				});
			}
			return;
		}
		router.push(`/${mode}`);
	};

	return (
		<MenuContainer>
			<MenuTitle text={t("title")}></MenuTitle>
			<MenuButtonContainer>
				<MenuButton onClick={() => startGame("vsPlayer")}>
					{" "}
					{t("play_vs_player")}{" "}
				</MenuButton>
				<MenuButton onClick={() => startGame("vsComputer")}>
					{" "}
					{t("play_vs_computer")}{" "}
				</MenuButton>
				<MenuButton onClick={() => startGame("liveMatch")}>
					{" "}
					{t("live_match")}{" "}
				</MenuButton>
				<MenuButton onClick={() => setActiveModal("tutorial")}>
					{" "}
					{t("tutorial")}{" "}
				</MenuButton>
				<MenuButton onClick={user ? handleSignOut : handleSignIn}>
					{user ? t("sign_out") : t("sign_in")}
				</MenuButton>
				<MenuButton onClick={() => setActiveModal("soundConfig")}>
					{t("adjust_sound")}
				</MenuButton>
				<MenuButton onClick={() => setActiveModal("shortcut")}>
					{t("keyboard_shortcuts")}
				</MenuButton>
			</MenuButtonContainer>
			<SoundConfigModal
				visible={activeModal === "soundConfig"}
				onClose={() => setActiveModal(null)}
			/>
			<ShortcutModal
				visible={activeModal === "shortcut"}
				onClose={() => setActiveModal(null)}
			/>
			<TutorialModal
				visible={activeModal === "tutorial"}
				onClose={() => setActiveModal(null)}
			/>
		</MenuContainer>
	);
};

export default Menu;
