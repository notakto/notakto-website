import clsx from "clsx";
import type { LeaderboardEntry } from "@/features/get-leaderboard/api/schema";

interface LeaderboardRowProps extends LeaderboardEntry {
	isCurrentUser?: boolean;
}

export function LeaderboardRow({
	rank,
	username,
	xp,
	isCurrentUser = false,
}: LeaderboardRowProps) {
	return (
		<tr
			className={clsx(
				"border-b border-cream/10 text-[8px] md:text-sm",

				// Current player: subtle red-tinted surface.
				isCurrentUser && "bg-primary/10",

				// Normal leaderboard ranking colors.
				!isCurrentUser && rank === 1 && "text-accent",
				!isCurrentUser && rank === 2 && "text-[#C9D1D9]",
				!isCurrentUser && rank === 3 && "text-[#CD7F32]",
				!isCurrentUser && rank > 3 && "text-cream",
			)}>
			<td
				className={clsx(
					"py-2 sm:py-3 px-1 sm:px-3 text-left whitespace-nowrap",

					// Red rail identifies the current player.
					isCurrentUser && "border-l-2 border-primary text-cream",
				)}>
				#{rank}
			</td>

			<td className="py-2 sm:py-3 px-0.5 sm:px-2 text-left truncate text-cream">
				<span>{username}</span>

				{isCurrentUser && (
					<span
						className={clsx(
							"ml-2 mb-1 inline-block",
							"border border-primary/50",
							"bg-primary/15",
							"px-1.5 py-0.5",
							"text-[6px] sm:text-[8px]",
							"leading-none text-primary",
							"align-middle",
						)}>
						YOU
					</span>
				)}
			</td>

			<td
				className={clsx(
					"py-2 sm:py-3 px-2 sm:px-3 text-right whitespace-nowrap",
					isCurrentUser ? "text-cream" : "text-cream/80",
				)}>
				{xp.toLocaleString()} XP
			</td>
		</tr>
	);
}
