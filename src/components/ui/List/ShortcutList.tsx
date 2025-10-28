import type { ShortcutListProps } from "@/services/types";

const ShortcutList = ({ shortcuts }: ShortcutListProps) => (
	<section>
		<dl className="grid grid-cols-2 gap-4 text-left">
			{shortcuts.map((shortcut) => (
				<div key={shortcut.key} className="flex flex-col items-start">
					<dt className="font-extrabold text-xl">{shortcut.key}</dt>
					<dd className="text-lg text-gray-300">{shortcut.action}</dd>
				</div>
			))}
		</dl>
	</section>
);

export default ShortcutList;
