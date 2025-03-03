import "@tanstack/react-query";

import { MutationCache, QueryClient, QueryCache } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";
import { Alert } from "react-native";


// const errorHandler = (error: unknown) => {
// 	if (!isAxiosError(error)) return;

// 	const requestUrl = error.config?.url;

// 	if (requestUrl?.includes('/login')) {
// 		return;
// 	}

// 	if (error.response?.status === 401) {
// 		Alert.alert("Session Expired", "Please login again");
// 	}
// };

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
			staleTime: 30 * 60 * 1000, // 30 minutes
		},
	},
});
