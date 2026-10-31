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
			? "bg-rose-700 hover:bg-rose-600 border-zinc-600"
			: variant === "primary"
				? "bg-yellow-500 hover:bg-yellow-700 border-zinc-600"
				: "bg-slate-800 hover:bg-slate-800 border-gray-700";

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={` text-[9px] sm:text-[10px] md:text-[10px] uppercase tracking-wider px-4 py-2.5 sm:px-5 md:px-6 md:py-2.5 border-3 shadow-[3px_3px_0_var(--color-slate-950)] transition-all duration-100 cursor-pointer ${colorClasses} ${
				disabled
					? "bg-gray-800! border-zinc-700! text-gray-500! cursor-not-allowed! shadow-none!"
					: "text-stone-300"
			}`}>
			<GameActionButtonLabel label={label} />
		</button>
	);
}
