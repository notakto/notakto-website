interface ProfileDetailValueProps {
	value: string | number;
	variant?: "default" | "accent";
}

export default function ProfileDetailValue({
	value,
	variant = "default",
}: ProfileDetailValueProps) {
	return (
		<span className={variant === "accent" ? "text-accent" : "text-cream"}>
			{value}
		</span>
	);
}
