interface GameModeIconProps {
	icon: string;
}

export default function GameModeIcon({ icon }: GameModeIconProps) {
	return (
		<div className="w-10 h-10 md:w-14 md:h-14 bg-bg0 border-3 border-border-pixel flex items-center justify-center shrink-0 group-hover:border-accent transition-colors">
			<span className="font-pixel text-xl text-accent">{icon}</span>
		</div>
	);
}
