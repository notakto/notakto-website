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
			className={`relative  text-[9px] sm:text-[10px] md:text-[10px] px-3.5 py-2.5 sm:px-4 md:px-5 md:py-3 flex items-center justify-center border-2 cursor-pointer transition-all whitespace-nowrap ${
				selected
					? "bg-slate-800 border-yellow-500 text-stone-300 shadow-[2px_2px_0_var(--color-yellow-500)]"
					: dead
						? "bg-slate-800 border-gray-700 text-gray-500"
						: "bg-slate-800 border-gray-700 text-stone-400 hover:text-stone-300 hover:border-yellow-500/50"
			}`}>
			<BoardSelectorTabLabel boardNumber={boardNumber} />
			<BoardSelectorStatusDot dead={dead} />
		</button>
	);
}
