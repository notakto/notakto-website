interface ProfileDetailValueProps {
	value: string | number;
	variant?: "default" | "accent";
}

export default function ProfileDetailValue({
	value,
	variant = "default",
}: ProfileDetailValueProps) {
	return (
		<span
			className={variant === "accent" ? "text-yellow-500" : "text-stone-300"}>
			{value}
		</span>
	);
}
