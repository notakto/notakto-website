import clsx from "clsx";
import type { LeaderboardEntry } from "@/features/get-leaderboard/api/schema";

export function LeaderboardRow({ rank, username, xp }: LeaderboardEntry) {
	return (
		<tr
			className={clsx(
				"border-b border-cream/10 text-[8px] md:text-sm",
				rank === 1 && "text-accent",
				rank === 2 && "text-[#C9D1D9]",
				rank === 3 && "text-[#CD7F32]",
				rank > 3 && "text-cream",
			)}>
			<td className="py-2 sm:py-3 px-1 sm:px-3 text-left whitespace-nowrap">
				#{rank}
			</td>
			<td className="py-2 sm:py-3 px-0.5 sm:px-2 text-left truncate">
				{username}
			</td>
			<td className="py-2 sm:py-3 px-2 sm:px-3 text-right whitespace-nowrap">
				{xp.toLocaleString()} XP
			</td>
		</tr>
	);
}
