import BoardSelectorStatusDot from "@/widgets/board-selector-status-dot/ui/BoardSelectorStatusDot";
import BoardSelectorTabLabel from "@/widgets/board-selector-tab-label/ui/BoardSelectorTabLabel";

interface BoardSelectorTabProps {
	boardNumber: number;
	dead: boolean;
	selected: boolean;
	onSelect: () => void;
}

export default function BoardSelectorTab({
	boardNumber,
	dead,
	selected,
	onSelect,
}: BoardSelectorTabProps) {
	return (
		<button
			type="button"
			onClick={onSelect}
			className={`relative font-pixel text-[9px] sm:text-[10px] md:text-[10px] px-3.5 py-2.5 sm:px-4 md:px-5 md:py-3 flex items-center justify-center border-2 cursor-pointer transition-all whitespace-nowrap ${
				selected
					? "bg-bg3 border-accent text-cream shadow-[2px_2px_0_var(--color-accent)]"
					: dead
						? "bg-bg2 border-border-pixel text-muted"
						: "bg-bg2 border-border-pixel text-cream-dim hover:text-cream hover:border-accent/50"
			}`}>
			<BoardSelectorTabLabel boardNumber={boardNumber} />
			<BoardSelectorStatusDot dead={dead} />
		</button>
	);
}
