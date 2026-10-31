interface ShortcutActionLabelProps {
	value: string;
}

export default function ShortcutActionLabel({
	value,
}: ShortcutActionLabelProps) {
	return <dd className=" text-[8px] text-gray-500">{value}</dd>;
}
