import { QueryFunction, QueryKey, useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Text } from "react-native";
import { PaginatedResponse } from "@/types/response";
import { ChatRoom } from "@/types/chat";
import config from "@/tailwind.config";
import { View } from "react-native";
import { api } from "@/api/_config";


export function withQueryWrapper<T>(
	query: {
		queryKey: QueryKey;
		queryFn: QueryFunction<PaginatedResponse<T>>;
	},
	Component: React.ComponentType<{ data: PaginatedResponse<T> }>,
) {
	return function WithQueryWrapper() {
		const { data, isLoading, isError, error } = useQuery({
			queryKey: query.queryKey,
			queryFn: query.queryFn,
		});

		if (isError) {
			return (
				<View className="flex-1 items-center justify-center">
					<Text>Error</Text>
				</View>
			);
		}

		if (isLoading) {
			return (
				<ActivityIndicator
					className="absolute bottom-0 left-0 right-0 top-0"
					size="large"
					color={config.theme.extend.colors.defaultGray}
				/>
			);
		}

		if (!data?.docs?.length) {
			return (
				<View className="flex-1 items-center justify-center">
					<Text>No content available</Text>
				</View>
			);
		}

		return <Component data={data} />;
	};
}
