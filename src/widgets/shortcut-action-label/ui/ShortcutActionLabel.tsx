interface ShortcutActionLabelProps {
	value: string;
}

export default function ShortcutActionLabel({
	value,
}: ShortcutActionLabelProps) {
	return <dd className="font-pixel text-[8px] text-muted">{value}</dd>;
}
