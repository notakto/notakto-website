"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useShortcut } from "@/components/hooks/useShortcut";
import { useToastCooldown } from "@/components/hooks/useToastCooldown";
import { MenuButton } from "@/components/ui/Buttons/MenuButton";
import MenuButtonContainer from "@/components/ui/Containers/Menu/MenuButtonContainer";
import MenuContainer from "@/components/ui/Containers/Menu/MenuContainer";
import { MenuTitle } from "@/components/ui/Title/MenuTitle";
import { TOAST_DURATION, TOAST_IDS } from "@/constants/toast";
import ShortcutModal from "@/modals/ShortcutModal";
import SoundConfigModal from "@/modals/SoundConfigModal";
import TutorialModal from "@/modals/TutorialModal";
import { signInWithGoogle, signOutUser } from "@/services/firebase";
import { signIn } from "@/services/game-apis";
import { useUser } from "@/services/store";

type ModalType = "soundConfig" | "shortcut" | "tutorial" | "profile" | null;
const Menu = () => {
	const user = useUser((state) => state.user);
	const setUser = useUser((state) => state.setUser);

	const router = useRouter();
	const { canShowToast, resetCooldown } = useToastCooldown(TOAST_DURATION);
	const [activeModal, setActiveModal] = useState<ModalType>(null);

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
			const user = await signInWithGoogle(); // ✅ get user directly
			const idToken = await user.getIdToken(); // ✅ guaranteed to exist

			if (!idToken) throw new Error("Failed to get ID token");

			const response = await signIn(idToken);

			console.log("Sign-in successful:", response);
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
				toast("Please sign in!", {
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
			<MenuTitle text="Notakto"></MenuTitle>
			<MenuButtonContainer>
				<MenuButton onClick={() => startGame("vsPlayer")}>
					{" "}
					Play vs Player{" "}
				</MenuButton>
				<MenuButton onClick={() => startGame("vsComputer")}>
					{" "}
					Play vs Computer{" "}
				</MenuButton>
				<MenuButton onClick={() => startGame("liveMatch")}>
					{" "}
					Live Match{" "}
				</MenuButton>
				<MenuButton onClick={() => setActiveModal("tutorial")}>
					{" "}
					Tutorial{" "}
				</MenuButton>
				<MenuButton onClick={user ? handleSignOut : handleSignIn}>
					{user ? "Sign Out" : "Sign in"}
				</MenuButton>
				<MenuButton onClick={() => setActiveModal("soundConfig")}>
					Adjust Sound
				</MenuButton>
				<MenuButton onClick={() => setActiveModal("shortcut")}>
					Keyboard Shortcuts
				</MenuButton>
				{
					//TODO: Merge Profile Button into Sign In Button and give sign out option there
				}
				<MenuButton onClick={() => setActiveModal("profile")}>
					Profile
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
