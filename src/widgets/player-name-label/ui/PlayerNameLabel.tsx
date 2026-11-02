interface PlayerNameLabelProps {
	name: string;
}

export default function PlayerNameLabel({ name }: PlayerNameLabelProps) {
	return (
		<div className=" text-[8px] sm:text-[11px] md:text-[12px] text-stone-300 uppercase tracking-wider truncate">
			{name}
		</div>
	);
}
