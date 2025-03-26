import "@tanstack/react-query";

import { QueryClient } from "@tanstack/react-query";


export const queryClient = new QueryClient({
	// queryCache: new QueryCache({
	// 	onError: errorHandler,
	// }),
	// mutationCache: new MutationCache({
	// 	onError: errorHandler,
	// }),

	defaultOptions: {
		queries: {
			retry: 1,
			// TODO
			// staleTime: 60 * 60 * 1000, // 1 hour
			staleTime: 0,
		},
	},
});
