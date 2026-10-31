import type {
	CurrentUser,
	LeaderboardEntry,
} from "@/features/get-leaderboard/api/schema";
import { LeaderboardHeader } from "@/widgets/leaderboard-header/ui/LeaderboardHeader";
import { LeaderboardRow } from "@/widgets/leaderboard-row/ui/LeaderboardRow";

export function LeaderboardList({
	leaderboard,
	currentUser,
}: {
	leaderboard: LeaderboardEntry[];
	currentUser: CurrentUser;
}) {
	const isCurrentUserInLeaderboard = leaderboard.some(
		(player) => player.username === currentUser.username,
	);

	return (
		<div className="max-h-[50dvh] sm:max-h-[60dvh] overflow-y-auto">
			<table className="w-full table-fixed  text-xs sm:text-sm uppercase tracking-wide sm:tracking-wider border-collapse">
				<LeaderboardHeader />

				<tbody>
					{leaderboard.map((player) => (
						<LeaderboardRow
							key={`${player.rank}-${player.username}`}
							{...player}
							isCurrentUser={player.username === currentUser.username}
						/>
					))}

					{!isCurrentUserInLeaderboard && (
						<>
							<tr>
								<td colSpan={3} className="py-2 text-center text-stone-300/40">
									...
								</td>
							</tr>

							<LeaderboardRow
								rank={currentUser.rank}
								username={currentUser.username}
								xp={currentUser.xp}
								isCurrentUser={true}
							/>
						</>
					)}
				</tbody>
			</table>
		</div>
	);
}
