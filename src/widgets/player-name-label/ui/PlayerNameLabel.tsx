interface PlayerNameLabelProps {
	name: string;
}

export default function PlayerNameLabel({ name }: PlayerNameLabelProps) {
	return (
		<div className="font-pixel text-[8px] sm:text-[11px] md:text-[12px] text-cream uppercase tracking-wider truncate">
			{name}
		</div>
	);
}
