import PixelLoadingIndicator from "@/widgets/pixel-loading-indicator/PixelLoadingIndicator";
import ProfileAvatar from "@/widgets/profile-avatar/ui/ProfileAvatar";
import ProfileDetails from "@/widgets/profile-details/ui/ProfileDetails";
import ProfileImageError from "@/widgets/profile-image-error/ui/ProfileImageError";
import ProfileLoginPrompt from "@/widgets/profile-login-prompt/ui/ProfileLoginPrompt";

interface ProfileContentProps {
	isAuthenticated: boolean;
	isPending: boolean;
	isError: boolean;
	error: Error | null;
	profile:
		| {
				name: string;
				username: string;
				email: string;
				profile_pic: string;
		  }
		| undefined;
	coins: number;
	xp: number;
}

const ProfileContent = ({
	isAuthenticated,
	isPending,
	isError,
	error,
	profile,
	coins,
	xp,
}: ProfileContentProps) => {
	if (!isAuthenticated) {
		return <ProfileLoginPrompt />;
	}

	if (isPending) {
		return <PixelLoadingIndicator />;
	}

	if (isError || !profile) {
		return (
			<p>{error?.message || "Unable to load profile. Please try again."}</p>
		);
	}

	return (
		<>
			{profile.profile_pic && profile.profile_pic !== "empty.empty" ? (
				<ProfileAvatar src={profile.profile_pic} />
			) : (
				<ProfileImageError />
			)}

			<ProfileDetails
				name={profile.name}
				username={profile.username}
				email={profile.email}
				coins={coins}
				xp={xp}
			/>
		</>
	);
};

export default ProfileContent;
