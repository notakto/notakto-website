import type { Shortcut } from "@/entities/shortcut/model/types";
import ShortcutActionLabel from "@/widgets/shortcut-action-label/ui/ShortcutActionLabel";
import ShortcutKeyLabel from "@/widgets/shortcut-key-label/ui/ShortcutKeyLabel";

interface ShortcutListItemProps {
	shortcut: Shortcut;
}

export default function ShortcutListItem({ shortcut }: ShortcutListItemProps) {
	return (
		<div className="flex flex-col items-start">
			<ShortcutKeyLabel value={shortcut.key} />
			<ShortcutActionLabel value={shortcut.action} />
		</div>
	);
}
