export function LeaderboardHeader() {
	return (
		<thead className="sticky top-0 bg-gray-800">
			<tr className="border-b-2 border-stone-300/40 text-stone-300/70">
				<th className="py-2 sm:py-3 px-2 sm:px-3 text-left w-14 sm:w-20">
					Rank
				</th>
				<th className="py-2 sm:py-3 px-2 sm:px-3 text-left">Player</th>
				<th className="py-2 sm:py-3 px-2 sm:px-3 text-right w-24 sm:w-32">
					XP
				</th>
			</tr>
		</thead>
	);
}
