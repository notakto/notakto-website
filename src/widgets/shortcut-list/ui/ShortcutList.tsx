import type { Shortcut } from "@/entities/shortcut/model/types";
import ShortcutListItem from "@/widgets/shortcut-list-item/ui/ShortcutListItem";

interface ShortcutListProps {
	shortcuts: Shortcut[];
}

const ShortcutList = ({ shortcuts }: ShortcutListProps) => (
	<section>
		<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
			{shortcuts.map((shortcut) => (
				<ShortcutListItem key={shortcut.key} shortcut={shortcut} />
			))}
		</dl>
	</section>
);

export default ShortcutList;
