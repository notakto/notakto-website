import Image from "next/image";
import { TutorialButton } from "@/components/ui/Buttons/TutorialButton";
import TutorialContainer from "@/components/ui/Containers/Tutorial/TutorialContainer";
import ModalOverlay from "@/components/ui/Overlays/ModalOverlay";
import TutorialTitle from "@/components/ui/Title/TutorialTitle";
import { useCoins, useProfile, useUser, useXP } from "@/services/store";
import type { TutorialModalProps } from "@/services/types";

const ProfileModal = ({ visible, onClose }: TutorialModalProps) => {
	const name = useProfile((state) => state.name);
	const email = useProfile((state) => state.email);
	const pic = useProfile((state) => state.pic);
	const coins = useCoins((state) => state.coins);
	const xp = useXP((state) => state.XP);

	const authReady = useUser((state) => state.authReady);
	const user = useUser((state) => state.user);

	if (!visible) return null;
	//   pic = null;
	return (
		<ModalOverlay>
			<TutorialContainer>
				<TutorialTitle text="Profile" />

				{authReady && user ? (
					<>
						{pic ? (
							<Image
								src={pic}
								alt="profile"
								width={120}
								height={100}
								className="mx-auto  border-black border-2"
							/>
						) : (
							<div className="mx-auto">Image load error</div>
						)}

						<div className="text-2xl text-center mt-5">Username : {name}</div>
						<div className="text-2xl text-center">Email : {email}</div>
						<div className="text-2xl text-center">Coins: {coins}</div>
						<div className="text-2xl text-center mb-5">XP: {xp}</div>
					</>
				) : (
					<div>Please login</div>
				)}

				<TutorialButton onClick={onClose}>Close&nbsp;Profile</TutorialButton>
			</TutorialContainer>
		</ModalOverlay>
	);
};

export default ProfileModal;
