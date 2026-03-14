import { useQuery } from "@tanstack/react-query";
import { createAuthenticatedQueryWithRefresh } from "@/lib/createAuthenticatedQuery";
import { queryKeys } from "@/lib/queryKeys";
import { signIn } from "@/services/game-apis";
import { useUser } from "@/services/store";

export function useUserProfile() {
	const { user } = useUser();

	return useQuery({
		queryKey: queryKeys.user(user?.uid ?? ""),
		queryFn: () =>
			createAuthenticatedQueryWithRefresh((token) => signIn(token)),
		enabled: !!user?.uid,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 10, // 10 minutes
	});
}
