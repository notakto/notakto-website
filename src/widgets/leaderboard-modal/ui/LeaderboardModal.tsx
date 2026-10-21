"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/features/authenticate-user/model/userStore";
import getLeaderboard from "@/features/get-leaderboard/api/leaderboardApis";
import type { LeaderboardEntry } from "@/features/get-leaderboard/api/schema";
import LeaderboardContainer from "@/widgets/leaderboard-container/ui/LeaderboardContainer";
import { LeaderboardControls } from "@/widgets/leaderboard-control/ui/LeaderboardControl";
import { LeaderboardList } from "@/widgets/leaderboard-list/ui/LeaderboardList";
import { LeaderboardTitle } from "@/widgets/leaderboard-title/ui/LeaderboardTitle";
import ModalOverlay from "@/widgets/modal-overlay/ui/ModalOverlay";
import PixelLoadingIndicator from "@/widgets/pixel-loading-indicator/PixelLoadingIndicator";

interface LeaderboardModalProps {
	visible: boolean;
	onClose?: () => void;
}

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

		let ignore = false;

		const loadLeaderboard = async () => {
			setLoading(true);
			setError(null);

			try {
				const idToken = await user?.getIdToken();

				if (!idToken) {
					throw new Error("User is not authenticated");
				}

				const response = await getLeaderboard(idToken);

				if (!ignore) {
					setLeaderboard(response.leaderboard);
				}
			} catch (error) {
				if (ignore) return;

				const message =
					error instanceof Error ? error.message : "Failed to load leaderboard";

				setError(message);
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		loadLeaderboard();

		return () => {
			ignore = true;
		};
	}, [visible, user]);

	if (!visible) return null;

	return (
		<ModalOverlay>
			<LeaderboardContainer>
				<LeaderboardTitle />

				{loading && (
					<p className="font-pixel text-xs text-cream/70 uppercase tracking-widest animate-pulse">
						<PixelLoadingIndicator title="Loading Leaderboard..." />
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
