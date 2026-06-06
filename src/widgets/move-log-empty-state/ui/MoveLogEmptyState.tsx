import MoveLogEmptySubtitle from "@/widgets/move-log-empty-subtitle/ui/MoveLogEmptySubtitle";
import MoveLogEmptyTitle from "@/widgets/move-log-empty-title/ui/MoveLogEmptyTitle";

export default function MoveLogEmptyState() {
	return (
		<div className="p-4 text-center">
			<MoveLogEmptyTitle />
			<MoveLogEmptySubtitle />
		</div>
	);
}
