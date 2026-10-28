"use client";

import { useQuery } from "@tanstack/react-query";
import { signIn } from "@/features/authenticate-user/api/authApis";
import { useAuthToken } from "@/hooks/useAuthToken";
import { createAuthenticatedQuery } from "@/lib/createAuthenticatedQuery";
import { queryKeys } from "@/lib/queryKeys";

export default function useUserProfile() {
	const { userId, isAuthLoading, isAuthenticated, getIdToken } = useAuthToken();

	return useQuery({
		queryKey: queryKeys.user(userId ?? ""),
		queryFn: createAuthenticatedQuery(getIdToken, signIn),
		enabled: !isAuthLoading && isAuthenticated && Boolean(userId),
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		refetchOnWindowFocus: false,
		retry: false,
	});
}
