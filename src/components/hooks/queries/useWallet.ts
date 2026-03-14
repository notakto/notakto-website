import { useQuery } from "@tanstack/react-query";
import { createAuthenticatedQueryWithRefresh } from "@/lib/createAuthenticatedQuery";
import { queryKeys } from "@/lib/queryKeys";
import { getWallet } from "@/services/game-apis";
import { useUser } from "@/services/store";

export function useWallet() {
	const { user } = useUser();

	return useQuery({
		queryKey: [...queryKeys.user(user?.uid ?? ""), "wallet"],
		queryFn: () =>
			createAuthenticatedQueryWithRefresh((token) => getWallet(token)),
		enabled: !!user?.uid,
		staleTime: 1000 * 60 * 2, // 2 minutes
	});
}
