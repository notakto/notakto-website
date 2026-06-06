import ProfileDetailLabel from "@/widgets/profile-detail-label/ui/ProfileDetailLabel";
import ProfileDetailValue from "@/widgets/profile-detail-value/ui/ProfileDetailValue";

interface ProfileDetailRowProps {
	label: string;
	value: string | number;
	variant?: "default" | "accent";
}

export default function ProfileDetailRow({
	label,
	value,
	variant,
}: ProfileDetailRowProps) {
	return (
		<div className="font-pixel text-[8px] text-cream-dim text-center">
			<ProfileDetailLabel label={label} />
			<ProfileDetailValue value={value} variant={variant} />
		</div>
	);
}
