import MoveLogCount from "@/widgets/move-log-count/ui/MoveLogCount";
import MoveLogTitle from "@/widgets/move-log-title/ui/MoveLogTitle";

interface MoveLogHeaderProps {
	count: number;
}

export default function MoveLogHeader({ count }: MoveLogHeaderProps) {
	return (
		<div className="px-4 py-2.5 border-b-2 border-gray-700 flex items-center justify-between shrink-0">
			<MoveLogTitle />
			<MoveLogCount count={count} />
		</div>
	);
}
