import "@tanstack/react-query";

import { MutationCache, QueryClient } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";


// declare module "@tanstack/react-query" {
// 	interface Register {
// 		// we use axios so we declare the type error returned
// 		defaultError: AxiosError;
// 	}

// 	interface MutationMeta {
// 		action?: "create" | "update" | "delete";
// 		message: string;
// 	}

// 	interface QueryFunctionContext {
// 		queryKey: [string, { page?: string; slug?: string, lang?: I18n }];
// 	}
// }

export const queryClient = new QueryClient({
	// mutationCache: new MutationCache({
	// 	onError: (err) => {
	// 		if (isAxiosError(err)) {
	// 			toast.error(err.response?.status, {
	// 				description: (err.response?.data as any)?.message || err.message,
	// 			});
	// 			return;
	// 		}

	// 		console.log({ err });
	// 		toast.error(i18n.en("SOMETHING_UNEXPECTED_HAPPENED"));
	// 	},
	// 	onSuccess: (_data, _variables, _context, mutation) => {
	// 		if (mutation.options.mutationKey) {
	// 			queryClient.invalidateQueries({ queryKey: mutation.options.mutationKey });
	// 		}

	// 		if (mutation.meta) {
	// 			toast.success(mutation.meta.message);
	// 		}
	// 	},
	// }),
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 30 * 60 * 1000, // 30 minutes
		},
	},
});
