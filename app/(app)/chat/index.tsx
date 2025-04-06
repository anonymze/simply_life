import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { ChevronRightIcon, LockIcon } from "lucide-react-native";
import { ChatRoom } from "@/types/chat";
import { Link } from "expo-router";
import React from "react";


export default function Page() {
	const [refreshing, setRefreshing] = React.useState(false);

	const handleRefresh = () => {};

	return (
		<LegendList
			// start at the end
			initialScrollIndex={chatRooms.length - 1}
			// with this one alignItemsAtEnd
			alignItemsAtEnd={true}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
			data={chatRooms}
			renderItem={({ item }) => (
				<Link
					style={{
						marginTop: 20,
					}}
					href={{
						pathname: "/chat/[chat]",
						params: {
							chat: item.id,
						},
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
						<ItemTitleAndDescription title={item.title} description={item.description} isPrivate={item.isPrivate} />
						<ChevronRightIcon size={24} color="#fff" />
					</View>
				</Link>
			)}
			estimatedItemSize={80}
			// strongly recommended prop (improves performance but becareful if you use states)
			keyExtractor={(item) => item.id}
			recycleItems={true}

			// ideal for chat you stay at the end of the list
			maintainScrollAtEnd={true}
			// maintainScrollAtEndThreshold * screen height (defines what percent of the screen counts as the bottom)
			maintainScrollAtEndThreshold={1}

			// otherwise content can be behind header
			contentInsetAdjustmentBehavior="automatic"
			contentContainerStyle={{
				// gap: 25,
				padding: 20,
			}}
		/>
	);
}

function ItemTitle({ title, isPrivate }: { title: string; isPrivate: boolean }) {
	return (
		<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
			<Text style={{ fontSize: 17, color: "#fff" }}>{title}</Text>
			{isPrivate && <LockIcon size={20} color="#fff" />}
		</View>
	);
}

function ItemTitleAndDescription({
	title,
	description,
	isPrivate,
}: {
	title: string;
	description: string;
	isPrivate: boolean;
}) {
	return (
		<View style={{ gap: 4 }}>
			<ItemTitle title={title} isPrivate={isPrivate} />
			<Text style={{ fontSize: 13, color: "#fff" }}>{description}</Text>
		</View>
	);
}

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
		isPrivate: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "4",
		title: "Chat Room 4",
		description: "Chat Room 4 Description",
		isPrivate: false,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: "5",
		title: "Chat Room 5",
		description: "Chat Room 5 Description",
		isPrivate: false,
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
