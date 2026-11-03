import { MutationCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";

export function createQueryClient() {
	return new QueryClient({
		mutationCache: new MutationCache({
			onError: (error: unknown) => {
				if (axios.isAxiosError(error)) {
					console.error("API Error:", error.response?.data || error.message);
				} else {
					console.error("Unexpected Error:", error);
				}
			},
		}),
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000,
				gcTime: 10 * 60 * 1000,
				refetchOnWindowFocus: false,
				retry: (failureCount, error) =>
					axios.isAxiosError(error) && !error.response && failureCount < 2,
			},
			mutations: {
				retry: false,
			},
		},
	});
}
