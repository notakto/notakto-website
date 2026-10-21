import type { LeaderboardEntry } from "@/features/get-leaderboard/api/schema";
import { LeaderboardHeader } from "@/widgets/leaderboard-header/ui/LeaderboardHeader";
import { LeaderboardRow } from "@/widgets/leaderboard-row/ui/LeaderboardRow";

export function LeaderboardList({
	leaderboard,
}: {
	leaderboard: LeaderboardEntry[];
}) {
	if (leaderboard.length === 0) {
		return (
			<p className="font-pixel text-center text-xs text-cream/70 uppercase tracking-widest py-4">
				No entries yet
			</p>
		);
	}

	return (
		<div className="max-h-[50dvh] sm:max-h-[60dvh] overflow-y-auto">
			<table className="w-full table-fixed font-pixel text-xs sm:text-sm uppercase tracking-wide sm:tracking-wider border-collapse">
				<LeaderboardHeader />

				<tbody>
					{leaderboard.map((player) => (
						<LeaderboardRow
							key={`${player.rank}-${player.username}`}
							rank={player.rank}
							username={player.username}
							xp={player.xp}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
