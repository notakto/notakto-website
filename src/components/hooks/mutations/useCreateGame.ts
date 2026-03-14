import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedQueryWithRefresh } from "@/lib/createAuthenticatedQuery";
import { queryKeys } from "@/lib/queryKeys";
import { createGame } from "@/services/game-apis";
import { useUser } from "@/services/store";
import type { BoardSize, DifficultyLevel } from "@/services/types";

export function useCreateGame() {
	const queryClient = useQueryClient();
	const { user } = useUser();

	return useMutation({
		mutationFn: ({
			numberOfBoards,
			boardSize,
			difficulty,
		}: {
			numberOfBoards: number;
			boardSize: BoardSize;
			difficulty: DifficultyLevel;
		}) =>
			createAuthenticatedQueryWithRefresh((token) =>
				createGame(numberOfBoards, boardSize, difficulty, token),
			),

		onSuccess: () => {
			if (user?.uid) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.user(user.uid),
				});
			}
		},
	});
}
