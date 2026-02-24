import type { ShortcutListProps } from "@/services/types";

const ShortcutList = ({ shortcuts }: ShortcutListProps) => (
	<section>
		<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
			{shortcuts.map((shortcut) => (
				<div key={shortcut.key} className="flex flex-col items-start">
					<dt className="font-pixel font-extrabold text-[9px] text-cream">
						{shortcut.key}
					</dt>
					<dd className="font-pixel text-[8px] text-muted">
						{shortcut.action}
					</dd>
				</div>
			))}
		</dl>
	</section>
);

export default ShortcutList;
