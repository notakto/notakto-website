export function LeaderboardControls({ onClose }: { onClose?: () => void }) {
	return (
		<div className="flex items-center justify-center">
			<button
				type="button"
				className="bg-primary hover:bg-primary-hover text-cream py-2 text-[9px] font-pixel uppercase tracking-wider flex-1 border-3 border-border-light shadow-[3px_3px_0_var(--color-bg0)] cursor-pointer"
				onClick={onClose}>
				Return
			</button>
		</div>
	);
}
