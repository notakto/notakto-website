import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAuthenticatedQueryWithRefresh } from "@/lib/createAuthenticatedQuery";
import { queryKeys } from "@/lib/queryKeys";
import { quitGame } from "@/services/game-apis";
import { useUser } from "@/services/store";

export function useQuitGame(sessionId: string) {
	const queryClient = useQueryClient();
	const { user } = useUser();

	return useMutation({
		mutationFn: () =>
			createAuthenticatedQueryWithRefresh((token) =>
				quitGame(sessionId, token),
			),

		onSettled: () => {
			queryClient.removeQueries({
				queryKey: queryKeys.game(sessionId),
			});
			if (user?.uid) {
				queryClient.invalidateQueries({
					queryKey: queryKeys.user(user.uid),
				});
			}
		},
	});
}
