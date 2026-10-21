"use client";

import clsx from "clsx";
import { CircleHelp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/features/authenticate-user/model/userStore";
import getLeaderboard from "@/features/get-leaderboard/api/leaderboardApis";
import type { LeaderboardEntry } from "@/features/get-leaderboard/api/schema";
import LeaderboardContainer from "@/widgets/leaderboard-container/ui/LeaderboardContainer";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import { SoundConfigButton } from "@/widgets/sound-config-button/ui/SoundConfigButton";

interface LeaderboardModalProps {
	visible: boolean;
	onClose?: () => void;
}

/* =========================================================
   INFO (HOW RANKING WORKS)
========================================================= */

export function LeaderboardInfo() {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;

		const handlePointer = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};

		document.addEventListener("pointerdown", handlePointer);
		document.addEventListener("keydown", handleKey);

		return () => {
			document.removeEventListener("pointerdown", handlePointer);
			document.removeEventListener("keydown", handleKey);
		};
	}, [open]);

	return (
		<div ref={ref} className="relative inline-flex">
			<button
				type="button"
				onClick={() => setOpen((prev) => !prev)}
				aria-label="How the leaderboard is ranked"
				aria-expanded={open}
				className={clsx(
					"p-2 -m-2 text-cream/70 hover:text-accent transition-colors cursor-pointer",
					open && "text-accent",
				)}>
				<CircleHelp size={18} />
			</button>

			{open && (
				<div
					role="tooltip"
					className="absolute right-0 top-full mt-3 w-[min(20rem,80vw)] z-20 bg-panel pixel-border p-3 sm:p-4 text-left font-pixel text-xs normal-case tracking-normal leading-relaxed text-cream">
					<p className="uppercase tracking-widest text-accent mb-2">
						How ranking works
					</p>
					<ul className="space-y-2 list-disc pl-4 text-cream/80">
						<li>Shows the top 10 players with XP.</li>
						<li>
							Ties share the same rank and the next rank is skipped (1, 1, 3).
						</li>
						<li>Tied players are sorted alphabetically by username.</li>
					</ul>
				</div>
			)}
		</div>
	);
}

/* =========================================================
   TITLE
========================================================= */

export function LeaderboardTitle({ text = "Leaderboard" }: { text?: string }) {
	return (
		<div className="flex items-center justify-between gap-3">
			<h2 className="text-cream font-pixel uppercase tracking-widest text-sm sm:text-base">
				{text}
			</h2>
			<LeaderboardInfo />
		</div>
	);
}

/* =========================================================
   HEADER
========================================================= */

export function LeaderboardHeader() {
	return (
		<thead className="sticky top-0 bg-panel">
			<tr className="border-b-2 border-cream/40 text-cream/70">
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

/* =========================================================
   ROW
========================================================= */

export function LeaderboardRow({ rank, username, xp }: LeaderboardEntry) {
	return (
		<tr
			className={clsx(
				"border-b border-cream/10",
				rank === 1 && "text-accent",
				rank === 2 && "text-[#C9D1D9]",
				rank === 3 && "text-[#CD7F32]",
				rank > 3 && "text-cream",
			)}>
			<td className="py-2 sm:py-3 px-2 sm:px-3 text-left whitespace-nowrap">
				#{rank}
			</td>
			<td className="py-2 sm:py-3 px-2 sm:px-3 text-left truncate">
				{username}
			</td>
			<td className="py-2 sm:py-3 px-2 sm:px-3 text-right whitespace-nowrap">
				{xp.toLocaleString()} XP
			</td>
		</tr>
	);
}

/* =========================================================
   LIST
========================================================= */

export function LeaderboardList({
	leaderboard,
}: {
	leaderboard: LeaderboardEntry[];
}) {
	if (leaderboard.length === 0) {
		return (
			<p className="font-pixel text-xs text-cream/70 uppercase tracking-widest py-4">
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

/* =========================================================
   CONTROLS
========================================================= */

export function LeaderboardControls({ onClose }: { onClose?: () => void }) {
	return (
		<div className="flex items-center justify-center">
			<SoundConfigButton onClick={onClose}>Return</SoundConfigButton>
		</div>
	);
}

/* =========================================================
   MODAL
========================================================= */

export default function LeaderboardModal({
	visible,
	onClose,
}: LeaderboardModalProps) {
	const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const user = useUser((state) => state.user);

	useEffect(() => {
		if (!visible) return;

		const loadLeaderboard = async () => {
			setLoading(true);
			setError(null);

			try {
				const idToken = await user?.getIdToken();

				if (!idToken) {
					throw new Error("User is not authenticated");
				}

				const response = await getLeaderboard(idToken);
				console.log(
					"leaderboard length:",
					response.leaderboard.length,
					response.leaderboard,
				);
				setLeaderboard(response.leaderboard);
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Failed to load leaderboard";

				setError(message);
			} finally {
				setLoading(false);
			}
		};

		loadLeaderboard();
	}, [visible, user]);

	if (!visible) return null;

	return (
		<ModalOverlay>
			<LeaderboardContainer>
				<LeaderboardTitle />

				{loading && (
					<p className="font-pixel text-xs text-cream/70 uppercase tracking-widest animate-pulse">
						Loading leaderboard...
					</p>
				)}

				{error && (
					<p className="font-pixel text-xs text-red-400 uppercase tracking-widest">
						{error}
					</p>
				)}

				{!loading && !error && <LeaderboardList leaderboard={leaderboard} />}

				<LeaderboardControls onClose={onClose} />
			</LeaderboardContainer>
		</ModalOverlay>
	);
}
