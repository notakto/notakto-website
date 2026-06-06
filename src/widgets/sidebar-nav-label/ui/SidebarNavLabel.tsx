interface SidebarNavLabelProps {
	label: string;
	visible: boolean;
}

export default function SidebarNavLabel({
	label,
	visible,
}: SidebarNavLabelProps) {
	if (!visible) return null;
	return <span>{label}</span>;
}
