"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import { useShortcut } from "@/components/hooks/useShortcut";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
import { signIn } from "@/services/game-apis";
import { useProfile, useUser } from "@/services/store";
import type { MenuModalType } from "@/services/types";

const Menu = () => {
	const user = useUser((state) => state.user);
	const setUser = useUser((state) => state.setUser);
	const setName = useProfile((state) => state.setName);
	const setEmail = useProfile((state) => state.setEmail);
	const setPic = useProfile((state) => state.setPic);

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
			// Step 1: Firebase popup
			const user = await signInWithGoogle();
			if (!user) throw new Error("No user returned from Google Sign-In");

			// Step 2: Get Firebase ID token
			const idToken = await user.getIdToken();

			// Step 3: Call backend sign-in API
			const backendUser = await signIn(idToken);
			// TODO: Use these values in the app as needed and delete these console logs
			console.log("Backend user data:", backendUser);
			console.log("Is New Account:", backendUser.new_account); // returns true if new account
			// Step 4: Update global user state (TODO)
			setUser(user);
			setName(backendUser.name);
			setEmail(backendUser.email);
			setPic(backendUser.profile_pic);
			// Step 5: Dismiss any existing sign-in error toasts
			toast.dismiss(TOAST_IDS.User.SignInError);
			resetCooldown();
		} catch (error) {
			console.error("Sign in error:", error);
		}
	};

	const handleSignOut = async () => {
		try {
			await signOutUser();
			setUser(null);
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
			<LanguageSwitcher />
		</MenuContainer>
	);
};

export default Menu;
