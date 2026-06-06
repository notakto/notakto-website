interface SidebarNavIconProps {
	icon: string;
}

export default function SidebarNavIcon({ icon }: SidebarNavIconProps) {
	return <span className="text-[10px] w-4 text-center shrink-0">{icon}</span>;
}
