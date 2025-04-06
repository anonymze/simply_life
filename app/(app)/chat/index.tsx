import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { ChatRoom } from "@/types/chat";
import { Link } from "expo-router";
import React from "react";


export const chatRooms: ChatRoom[] = [
	{
		id: "1",
		title: "Chat Room 1",
		description: "Chat Room 1 Description",
		isPrivate: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "2",
		title: "Chat Room 2",
		description: "Chat Room 2 Description",
		isPrivate: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "3",
		title: "Chat Room 3",
		description: "Chat Room 3 Description",
		isPrivate: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "4",
		title: "Chat Room 4",
		description: "Chat Room 4 Description",
		isPrivate: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "5",
		title: "Chat Room 5",
		description: "Chat Room 5 Description",
		isPrivate: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "6",
		title: "Chat Room 6",
		description: "Chat Room 6 Description",
		isPrivate: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "7",
		title: "Chat Room 7",
		description: "Chat Room 7 Description",
		isPrivate: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "8",
		title: "Chat Room 8",
		description: "Chat Room 8 Description",
		isPrivate: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "9",
		title: "Chat Room 9",
		description: "Chat Room 9 Description",
		isPrivate: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];

export default function Page() {
	const [refreshing, setRefreshing] = React.useState(false);

	const handleRefresh = () => {};

	return (
		<LegendList
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
			data={chatRooms}
			renderItem={({ item }) => (
				<Link href={{
					pathname: "/chat/[chat]",
					params: {
						chat: item.id,
					},
				}}>
					<Text>{item.title}</Text>
				</Link>
			)}
			// estimatedItemSize={10}
			// strongly recommended prop (improves performance but becareful if you use states)
			keyExtractor={(item) => item.id}
			recycleItems={true}
			// ideal for chat you stay at the end of the list
			maintainScrollAtEnd={true}
			// maintainScrollAtEndThreshold * screen height
			maintainScrollAtEndThreshold={1}
			// otherwise content can be behind header
			contentInsetAdjustmentBehavior="automatic"
			contentContainerStyle= {{
				gap: 20,
			}}
		/>
	);
}
