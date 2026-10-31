interface ShortcutKeyLabelProps {
	value: string;
}

export default function ShortcutKeyLabel({ value }: ShortcutKeyLabelProps) {
	return <dt className=" font-extrabold text-[9px] text-stone-300">{value}</dt>;
}
