import { useCoins, useXP } from "@/features/manage-wallet/model/walletStore";
import useUserProfile from "@/hooks/queries/useUserProfile";
import { useAuthToken } from "@/hooks/useAuthToken";

import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import PixelLoadingIndicator from "@/widgets/pixel-loading-indicator/PixelLoadingIndicator";
import { ProfileButton } from "@/widgets/profile-button/ui/ProfileButton";
import ProfileContainer from "@/widgets/profile-container/ui/ProfileContainer";
import ProfileContent from "@/widgets/profile-modal/ui/ProfileContent";
import ProfileTitle from "@/widgets/profile-title/ui/ProfileTitle";

interface ProfileModalProps {
	visible: boolean;
	onClose?: () => void;
}

const ProfileModal = ({ visible, onClose }: ProfileModalProps) => {
	const coins = useCoins((state) => state.coins);
	const xp = useXP((state) => state.XP);

	const { isAuthenticated, isAuthLoading } = useAuthToken();

	const { data: profile, isPending, isError, error } = useUserProfile();

	if (!visible) return null;

	if (isAuthLoading) {
		return <PixelLoadingIndicator />;
	}

	return (
		<ModalOverlay>
			<ProfileContainer>
				<ProfileTitle text="Profile" />

				<ProfileContent
					isAuthenticated={isAuthenticated}
					isPending={isPending}
					isError={isError}
					error={error}
					profile={profile}
					coins={coins}
					xp={xp}
				/>

				<ProfileButton onClick={onClose}>Close&nbsp;Profile</ProfileButton>
			</ProfileContainer>
		</ModalOverlay>
	);
};

export default ProfileModal;
