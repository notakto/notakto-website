import {
	useCoins,
	useProfile,
	useUser,
	useXP,
} from "@/features/app-state/model/stores";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import ProfileAvatar from "@/widgets/profile-avatar/ui/ProfileAvatar";
import { ProfileButton } from "@/widgets/profile-button/ui/ProfileButton";
import ProfileContainer from "@/widgets/profile-container/ui/ProfileContainer";
import ProfileDetails from "@/widgets/profile-details/ui/ProfileDetails";
import ProfileImageError from "@/widgets/profile-image-error/ui/ProfileImageError";
import ProfileLoginPrompt from "@/widgets/profile-login-prompt/ui/ProfileLoginPrompt";
import ProfileTitle from "@/widgets/profile-title/ui/ProfileTitle";

interface ProfileModalProps {
	visible: boolean;
	onClose?: () => void;
}

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
						{isValidPic ? <ProfileAvatar src={pic} /> : <ProfileImageError />}
						<ProfileDetails name={name} email={email} coins={coins} xp={xp} />
					</>
				) : (
					<ProfileLoginPrompt />
				)}

				<ProfileButton onClick={onClose}>Close&nbsp;Profile</ProfileButton>
			</ProfileContainer>
		</ModalOverlay>
	);
};

export default ProfileModal;
