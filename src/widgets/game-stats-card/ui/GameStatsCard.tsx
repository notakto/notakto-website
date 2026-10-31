import GameStatItem from "@/widgets/game-stat-item/ui/GameStatItem";

interface StatItem {
	label: string;
	value: string | number;
}

interface GameStatsCardProps {
	stats: StatItem[];
}

export default function GameStatsCard({ stats }: GameStatsCardProps) {
	return (
		<div className="pixel-border bg-slate-800 p-4 shrink-0">
			<div className=" text-[9px] text-yellow-500 uppercase mb-3">
				MATCH STATS
			</div>
			<div className="grid grid-cols-2 gap-3">
				{stats.map((stat) => (
					<GameStatItem
						key={stat.label}
						label={stat.label}
						value={stat.value}
					/>
				))}
			</div>
		</div>
	);
}
