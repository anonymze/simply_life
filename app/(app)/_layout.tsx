import { NotificationProvider } from "@/context/push-notifications";
import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react-native";
import HeaderLayout from "@/layouts/headert-layout";
import { Stack, Redirect, Link } from "expo-router";
import { getStorageUserInfos } from "@/utils/store";
import { truncateText } from "@/utils/helper";
import { userHierarchy } from "@/types/user";
import React from "react";


export default function AppLayout() {
	const userInfos = getStorageUserInfos();

	if (!userInfos || !userInfos.token) {
		return <Redirect href="/login" />;
	}

	return (
		<NotificationProvider>
			<Stack
				initialRouteName="index"
				screenOptions={{
					headerShown: true,
					gestureDirection: "horizontal",
					gestureEnabled: true,
					fullScreenGestureEnabled: true,
					gestureResponseDistance: {
						start: 0,
						end: 120,
					},
				}}
			>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="presentation"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="sponsors"
					options={{
						gestureEnabled: false,
						header: () => <HeaderLayout title="Sponsors" />,
					}}
				/>
				<Stack.Screen
					name="signature"
					options={{
						header: () => <HeaderLayout title="Signature" />,
					}}
				/>
				<Stack.Screen
					name="slider"
					options={{
						header: () => <HeaderLayout title="Signature" />,
					}}
				/>
				<Stack.Screen
					name="chat/index"
					options={{
						headerLargeTitle: true,
						headerTitle: "Chat rooms",
						headerRight: () => {
							if (userHierarchy[userInfos.user.role] > 0) return null;

							return (
								<Link href="/chat/new-room">
									<PlusCircleIcon size={24} color="#000" />
								</Link>
							);
						},
						headerLeft: () => (
							<Link dismissTo href="/">
								<ArrowLeftIcon size={24} color="#000" />
							</Link>
						),
					}}
				/>
				<Stack.Screen
					name="chat/[chat]"
					// Set title to empty string to prevent showing [chat] in the header while chat room title is being fetched
					options={{
						header: (props) => {
							return <HeaderLayout title={truncateText(props.options.title || "", 22)} />;
						},
					}}
				/>
				<Stack.Screen
					name="chat/new-room"
					options={{
						presentation: "modal",
						header: () => <HeaderLayout title="New room" />,
					}}
				/>
				<Stack.Screen
					name="performance"
					options={{
						header: () => <HeaderLayout title="Performance" />,
					}}
				/>
			</Stack>
		</NotificationProvider>
	);
}
