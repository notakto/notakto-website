import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedQueryWithRefresh } from "@/lib/createAuthenticatedQuery";
import { queryKeys } from "@/lib/queryKeys";
import { skipMove } from "@/services/game-apis";

export function useSkipMove(sessionId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () =>
			createAuthenticatedQueryWithRefresh((token) =>
				skipMove(sessionId, token),
			),

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.game(sessionId),
			});
		},
	});
}
