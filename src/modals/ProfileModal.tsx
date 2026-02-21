import Image from "next/image";
import { ProfileButton } from "@/components/ui/Buttons/ProfileButton";
import ProfileContainer from "@/components/ui/Containers/Profile/ProfileContainer";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import ProfileTitle from "@/components/ui/Title/ProfileTitle";
import { useCoins, useProfile, useUser, useXP } from "@/services/store";
import type { ProfileModalProps } from "@/services/types";

const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
	const name = useProfile((state) => state.name);
	const email = useProfile((state) => state.email);
	const pic = useProfile((state) => state.pic);
	const coins = useCoins((state) => state.coins);
	const xp = useXP((state) => state.XP);

	const authReady = useUser((state) => state.authReady);
	const user = useUser((state) => state.user);
	const isValidPic = pic && pic !== "empty.empty";
	if (!visible) return null;
	return (
		<ModalOverlay>
			<ProfileContainer>
				<ProfileTitle text="Profile" />

				{authReady && user ? (
					<>
						{isValidPic ? (
							<Image
								src={pic}
								alt="profile"
								width={80}
								height={80}
								className="mx-auto border-border-pixel border-3"
							/>
						) : (
							<div className="mx-auto font-pixel text-[8px] text-muted">
								IMAGE LOAD ERROR
							</div>
						)}

						<div className="space-y-2 my-4">
							<div className="font-pixel text-[8px] text-cream-dim text-center">
								NAME: <span className="text-cream">{name}</span>
							</div>
							<div className="font-pixel text-[8px] text-cream-dim text-center">
								EMAIL: <span className="text-cream">{email}</span>
							</div>
							<div className="font-pixel text-[8px] text-cream-dim text-center">
								COINS: <span className="text-accent">{coins}</span>
							</div>
							<div className="font-pixel text-[8px] text-cream-dim text-center">
								XP: <span className="text-accent">{xp}</span>
							</div>
						</div>
					</>
				) : (
					<div className="font-pixel text-[9px] text-muted m-5 text-center">
						PLEASE LOGIN
					</div>
				)}

				<ProfileButton onClick={onClose}>Close&nbsp;Profile</ProfileButton>
			</ProfileContainer>
		</ModalOverlay>
	);
};

export default ProfileModal;
