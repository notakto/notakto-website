interface Shortcut {
	key: string;
	action: string;
}

interface ShortcutListProps {
	shortcuts: Shortcut[];
}

const ShortcutList = ({ shortcuts }: ShortcutListProps) => (
	<div className="grid grid-cols-2 gap-4 text-left">
		{shortcuts.map((shortcut) => (
			<div key={shortcut.key} className="flex flex-col items-start">
				<h4 className="font-extrabold text-xl">{shortcut.key}</h4>
				<p className="text-lg text-gray-300">{shortcut.action}</p>
			</div>
		))}
	</div>
);

export default ShortcutList;
