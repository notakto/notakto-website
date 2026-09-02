import ProfileDetailRow from "@/widgets/profile-detail-row/ui/ProfileDetailRow";
import ProfileNameRow from "@/widgets/profile-name-row/ui/ProfileNameRow";

interface ProfileDetailsProps {
	name: string;
	email: string;
	coins: number;
	xp: number;
}

export default function ProfileDetails({
	name,
	email,
	coins,
	xp,
}: ProfileDetailsProps) {
	return (
		<div className="space-y-2 my-4">
			<ProfileNameRow value={name} />
			<ProfileDetailRow label="EMAIL" value={email} />
			<ProfileDetailRow label="COINS" value={coins} variant="accent" />
			<ProfileDetailRow label="XP" value={xp} variant="accent" />
		</div>
	);
}
