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
import { useUser } from "@/services/store";
import type { MenuModalType } from "@/services/types";

const Menu = () => {
	const user = useUser((state) => state.user);
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
				toast(
					<div className="flex flex-col gap-2">
						<span>Please sign in!</span>
						<button
							type="button"
							onClick={async () => {
								await handleSignIn();
							}}
							className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
							Sign In
						</button>
					</div>,
					{
						toastId: TOAST_IDS.User.SignInError,
						autoClose: TOAST_DURATION,
						onClose: resetCooldown,
					},
				);
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
