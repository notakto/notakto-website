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
								width={120}
								height={100}
								className="mx-auto  border-black border-2"
							/>
						) : (
							<div className="mx-auto text-xl">Image load error</div>
						)}

						<div className="text-2xl text-center mt-5">Name : {name}</div>
						<div className="text-2xl text-center">Email : {email}</div>
						<div className="text-2xl text-center">Coins: {coins}</div>
						<div className="text-2xl text-center mb-5">XP: {xp}</div>
					</>
				) : (
					<div className="text-2xl m-5 text-center">Please login</div>
				)}

				<ProfileButton onClick={onClose}>Close&nbsp;Profile</ProfileButton>
			</ProfileContainer>
		</ModalOverlay>
	);
};

export default ProfileModal;
