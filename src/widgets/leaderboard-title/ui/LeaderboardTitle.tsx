import { LeaderboardInfo } from "@/widgets/leaderboard-info/ui/LeaderboardInfo";

export function LeaderboardTitle({ text = "Leaderboard" }: { text?: string }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<h2 className="text-stone-300  uppercase tracking-widest text-sm sm:text-base">
				{text}
			</h2>
			<LeaderboardInfo />
		</div>
	);
}
