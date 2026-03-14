import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedQueryWithRefresh } from "@/lib/createAuthenticatedQuery";
import { queryKeys } from "@/lib/queryKeys";
import { undoMove } from "@/services/game-apis";

export function useUndoMove(sessionId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			createAuthenticatedQueryWithRefresh((token) =>
				undoMove(sessionId, token),
			),

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.game(sessionId),
			});
		},
	});
}
