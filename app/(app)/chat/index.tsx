import { getChatRoomsQuery } from "@/api/queries/chat-room-queries";
import { ChevronRightIcon, LockIcon } from "lucide-react-native";
import { withQueryWrapper } from "@/utils/libs/react-query";
import { LegendList } from "@legendapp/list";
import { Text, View } from "react-native";
import React, { useState } from "react";
import { ChatRoom } from "@/types/chat";
import { Link } from "expo-router";


export default function Page() {
	return withQueryWrapper<ChatRoom>(
		{
			queryKey: ["chat-rooms"],
			queryFn: getChatRoomsQuery,
		},
		({ data }) => {
			return (
				<LegendList
					initialScrollIndex={data.docs.length - 1}
					alignItemsAtEnd={true}
					data={data.docs}
					renderItem={({ item }) => (
						<Link
							style={{ marginTop: 20 }}
							href={{
								pathname: "/chat/[chat]",
								params: { chat: item.id },
							}}
						>
							<View
								style={{
									gap: 6,
									padding: 16,
									width: "100%",
									borderRadius: 16,
									alignItems: "center",
									flexDirection: "row",
									backgroundColor: "#000",
									justifyContent: "space-between",
								}}
							>
								<ItemTitleAndDescription name={item.name} description={item.description} isPrivate={item.isPrivate} />
								<ChevronRightIcon size={24} color="#fff" />
							</View>
						</Link>
					)}
					estimatedItemSize={80}
					keyExtractor={(item) => item.id}
					recycleItems={true}
					maintainScrollAtEnd={true}
					maintainScrollAtEndThreshold={1}
					contentInsetAdjustmentBehavior="automatic"
					contentContainerStyle={{ padding: 20 }}
				/>
			);
		},
	)();
}

function ItemTitle({ name, isPrivate }: Pick<ChatRoom, "name" | "isPrivate">) {
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
	isPrivate,
}: Pick<ChatRoom, "name" | "description" | "isPrivate">) {
	return (
		<View className="gap-2">
			<ItemTitle name={name} isPrivate={isPrivate} />
			<Text className="text-sm text-white">{description}</Text>
		</View>
	);
}
