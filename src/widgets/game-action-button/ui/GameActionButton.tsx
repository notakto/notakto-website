import GameActionButtonLabel from "@/widgets/game-action-button-label/ui/GameActionButtonLabel";

interface GameActionButtonProps {
	label: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "primary" | "default" | "danger";
}

export default function GameActionButton({
	label,
	onClick,
	disabled,
	variant,
}: GameActionButtonProps) {
	const colorClasses =
		variant === "danger"
			? "bg-primary hover:bg-primary-hover border-border-light"
			: variant === "primary"
				? "bg-accent hover:bg-accent-dim border-border-light"
				: "bg-bg3 hover:bg-bg2 border-border-pixel";

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`font-pixel text-[9px] sm:text-[10px] md:text-[10px] uppercase tracking-wider px-4 py-2.5 sm:px-5 md:px-6 md:py-2.5 border-3 shadow-[3px_3px_0_var(--color-bg0)] transition-all duration-100 cursor-pointer ${colorClasses} ${
				disabled
					? "bg-dead! border-dead-border! text-muted! cursor-not-allowed! shadow-none!"
					: "text-cream"
			}`}>
			<GameActionButtonLabel label={label} />
		</button>
	);
}
