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
			className="bg-slate-800 hover:bg-slate-800 text-stone-300 text-[10px]  uppercase tracking-wider w-full py-3 border-3 border-gray-700 shadow-[3px_3px_0_var(--color-slate-950)] cursor-pointer">
			Cancel
		</button>
	);
}
