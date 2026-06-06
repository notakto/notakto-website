interface ProfileDetailLabelProps {
	label: string;
}

export default function ProfileDetailLabel({ label }: ProfileDetailLabelProps) {
	return <>{label}: </>;
}
