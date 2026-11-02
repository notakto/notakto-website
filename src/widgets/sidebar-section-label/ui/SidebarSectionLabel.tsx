interface SidebarSectionLabelProps {
	label: string;
	visible: boolean;
}

export default function SidebarSectionLabel({
	label,
	visible,
}: SidebarSectionLabelProps) {
	if (!visible) return null;

	return (
		<div className="px-4 py-2  text-[6px] text-gray-500 uppercase tracking-widest">
			{label}
		</div>
	);
}
