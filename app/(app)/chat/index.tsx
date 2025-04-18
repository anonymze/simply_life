import { getChatRoomsQuery } from "@/api/queries/chat-room-queries";
import { getMessagesQuery } from "@/api/queries/message-queries";
import { ChevronRightIcon, LockIcon } from "lucide-react-native";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { FlatList } from "react-native-gesture-handler";
import { useQueryClient } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { ChatRoom } from "@/types/chat";
import { Link } from "expo-router";
import React from "react";


export const MAX_MESSAGES = 25;

export default function Page() {
	const queryClient = useQueryClient();

	const prefetchMessages = React.useCallback(
		async (chatId: string) => {
			// prefetch messages for this chat room
			await queryClient.prefetchQuery({
				queryKey: ["messages", chatId, MAX_MESSAGES],
				queryFn: getMessagesQuery,
			});
		},
		[queryClient],
	);

	return withQueryWrapper<ChatRoom>(
		{
			queryKey: ["chat-rooms"],
			queryFn: getChatRoomsQuery,
		},
		({ data }) => {
			return (
				<FlatList
					data={data.docs}
					renderItem={({ item }) => (
						<Link
							href={{
								pathname: "/chat/[chat]",
								params: { chat: item.id },
							}}
						>
							<View className="w-full flex-row items-center justify-between gap-4 rounded-xl bg-black p-5">
								<ItemTitleAndDescription name={item.name} description={item.description} private={item.private} />
								<ChevronRightIcon size={24} color="#fff" />
							</View>
						</Link>
					)}
					keyExtractor={(item) => item.id}
					contentInsetAdjustmentBehavior="automatic"
					contentContainerStyle={{
						gap: 20,
						padding: 20,
					}}
					onViewableItemsChanged={({ viewableItems }) => {
						// prefetch messages for visible chat rooms
						for (const item of viewableItems) {
							if (!item.isViewable) continue;
							prefetchMessages(item.item.id);
						}
					}}
					viewabilityConfig={{
						itemVisiblePercentThreshold: 75, // item is considered visible when 75% visible
					}}
				/>
			);

			// <LegendList
			// 		initialScrollIndex={data.docs.length - 1}
			// 		alignItemsAtEnd={true}
			// 		data={data.docs}
			// 		renderItem={({ item }) => (
			// 			<Link
			// 				style={{ marginTop: 20 }}
			// 				href={{
			// 					pathname: "/chat/[chat]",
			// 					params: { chat: item.id },
			// 				}}
			// 			>
			// 				<View
			// 					style={{
			// 						gap: 6,
			// 						padding: 16,
			// 						width: "100%",
			// 						borderRadius: 16,
			// 						alignItems: "center",
			// 						flexDirection: "row",
			// 						backgroundColor: "#000",
			// 						justifyContent: "space-between",
			// 					}}
			// 				>
			// 					<ItemTitleAndDescription name={item.name} description={item.description} private={item.private} />
			// 					<ChevronRightIcon size={24} color="#fff" />
			// 				</View>
			// 			</Link>
			// 		)}
			// 		estimatedItemSize={data.docs.length}
			// 		keyExtractor={(item) => item.id}
			// 		recycleItems={false}
			// 		maintainScrollAtEnd={true}
			// 		maintainScrollAtEndThreshold={0.1}
			// 		contentInsetAdjustmentBehavior="automatic"
			// 		contentContainerStyle={{ padding: 20 }}
			// 	/>
		},
	)();
}

function ItemTitle({ name, private: isPrivate }: Pick<ChatRoom, "name" | "private">) {
	return (
		<View className="flex-row items-center gap-4">
			<Text className="text-lg text-white">{name}</Text>
			{isPrivate && <LockIcon size={20} color="#fff" />}
		</View>
	);
}

function ItemTitleAndDescription({
	name,
	description,
	private: isPrivate,
}: Pick<ChatRoom, "name" | "description" | "private">) {
	return (
		<View className="flex-shrink gap-2">
			<ItemTitle name={name} private={isPrivate} />
			<Text className="flex-shrink text-sm text-white">{description}</Text>
		</View>
	);
}
