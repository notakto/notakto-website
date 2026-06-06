interface PlayerCancelButtonProps {
	onClick: () => void;
}

export default function PlayerCancelButton({
	onClick,
}: PlayerCancelButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="bg-bg2 hover:bg-bg3 text-cream text-[10px] font-pixel uppercase tracking-wider w-full py-3 border-3 border-border-pixel shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer">
			Cancel
		</button>
	);
}
