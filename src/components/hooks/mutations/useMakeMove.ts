import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedQueryWithRefresh } from "@/lib/createAuthenticatedQuery";
import { queryKeys } from "@/lib/queryKeys";
import { makeMove } from "@/services/game-apis";
import { useUser } from "@/services/store";

export function useMakeMove(sessionId: string) {
	const queryClient = useQueryClient();
	const { user } = useUser();

	return useMutation({
		mutationFn: ({
			boardIndex,
			cellIndex,
		}: {
			boardIndex: number;
			cellIndex: number;
		}) =>
			createAuthenticatedQueryWithRefresh((token) =>
				makeMove(sessionId, boardIndex, cellIndex, token),
			),

		onMutate: async ({ boardIndex, cellIndex }) => {
			// Cancel outgoing refetches
			await queryClient.cancelQueries({
				queryKey: queryKeys.game(sessionId),
			});
			// Snapshot previous value for rollback
			const previousGame = queryClient.getQueryData(queryKeys.game(sessionId));
			return { previousGame };
		},

		onError: (_err, _variables, context) => {
			// Rollback on error
			if (context?.previousGame) {
				queryClient.setQueryData(
					queryKeys.game(sessionId),
					context.previousGame,
				);
			}
		},

		onSettled: () => {
			// Always refetch after mutation
			queryClient.invalidateQueries({
				queryKey: queryKeys.game(sessionId),
			});
			// Also invalidate wallet (coins may change after a win)
			if (user?.uid) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.user(user.uid),
				});
			}
		},
	});
}
