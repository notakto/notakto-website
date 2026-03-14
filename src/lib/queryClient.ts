import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			retry: (failureCount, error: any) => {
				// Don't retry on 401/403 auth errors
				if (error?.status === 401 || error?.status === 403) return false;
				return failureCount < 2;
			},
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: (failureCount, error: any) => {
				// Only retry on network errors, not validation errors
				if (error?.status >= 400 && error?.status < 500) return false;
				return failureCount < 1;
			},
		},
	},
});
