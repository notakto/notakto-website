import ProfileDetailRow from "@/widgets/profile-detail-row/ui/ProfileDetailRow";
import ProfileNameRow from "@/widgets/profile-name-row/ui/ProfileNameRow";
import ProfileUsernameRow from "@/widgets/profile-username-row/ui/ProfileUsernameRow";

interface ProfileDetailsProps {
	name: string;
	username: string;
	email: string;
	coins: number;
	xp: number;
}

export default function ProfileDetails({
	name,
	username,
	email,
	coins,
	xp,
}: ProfileDetailsProps) {
	return (
		<div className="space-y-5 my-7">
			<ProfileUsernameRow value={username} />
			<ProfileNameRow value={name} />
			<ProfileDetailRow label="EMAIL" value={email} />
			<ProfileDetailRow label="COINS" value={coins} variant="accent" />
			<ProfileDetailRow label="XP" value={xp} variant="accent" />
		</div>
	);
}
