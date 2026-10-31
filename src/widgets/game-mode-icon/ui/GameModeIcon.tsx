interface GameModeIconProps {
	icon: string;
}

export default function GameModeIcon({ icon }: GameModeIconProps) {
	return (
		<div className="w-10 h-10 md:w-14 md:h-14 bg-slate-950 border-3 border-gray-700 flex items-center justify-center shrink-0 group-hover:border-yellow-500 transition-colors">
			<span className=" text-xl text-yellow-500">{icon}</span>
		</div>
	);
}
