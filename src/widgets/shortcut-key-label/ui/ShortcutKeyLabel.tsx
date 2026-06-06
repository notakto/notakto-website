interface ShortcutKeyLabelProps {
	value: string;
}

export default function ShortcutKeyLabel({ value }: ShortcutKeyLabelProps) {
	return (
		<dt className="font-pixel font-extrabold text-[9px] text-cream">{value}</dt>
	);
}
