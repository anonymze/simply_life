import { NotificationProvider } from "@/context/push-notifications";
import { View, Text, Pressable } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Link, Stack, Redirect } from "expo-router";
import { getStorageUserInfos } from "@/utils/store";


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
						header: () => (
							<View className="w-full items-center justify-center bg-white p-4">
								<Link href="../" asChild>
									<Pressable className="absolute left-1 p-3 active:opacity-70">
										<SimpleLineIcons name="arrow-left" size={20} color="black" />
									</Pressable>
								</Link>
								<Text className="text-lg font-bold">Sponsors</Text>
							</View>
						),
					}}
				/>
				<Stack.Screen
					name="signature"
					options={{
						header: () => (
							<View className="w-full items-center justify-center bg-white p-4">
								<Link href="../" asChild>
									<Pressable className="absolute left-1 p-3 active:opacity-70">
										<SimpleLineIcons name="arrow-left" size={20} color="black" />
									</Pressable>
								</Link>
								<Text className="text-lg font-bold">Signature</Text>
							</View>
						),
					}}
				/>
				<Stack.Screen
					name="chat"
					options={{
						headerShown: false,
						header: () => (
							<View className="w-full items-center justify-center bg-white p-4">
								<Link href="../" asChild>
									<Pressable className="absolute left-1 p-3 active:opacity-70">
										<SimpleLineIcons name="arrow-left" size={20} color="black" />
									</Pressable>
								</Link>
								<Text className="text-lg font-bold">Chat</Text>
							</View>
						),
					}}
				/>
				<Stack.Screen
					name="test"
					options={{
						header: () => (
							<View className="w-full items-center justify-center bg-white p-4">
								<Link href="../" asChild>
									<Pressable className="absolute left-1 p-3 active:opacity-70">
										<SimpleLineIcons name="arrow-left" size={20} color="black" />
									</Pressable>
								</Link>
								<Text className="text-lg font-bold">Signature</Text>
							</View>
						),
					}}
				/>
				<Stack.Screen
					name="performance"
					options={{
						header: () => (
							<View className="w-full items-center justify-center bg-white p-4">
								<Link href="../" asChild>
									<Pressable className="absolute left-1 p-3 active:opacity-70">
										<SimpleLineIcons name="arrow-left" size={20} color="black" />
									</Pressable>
								</Link>
								<Text className="text-lg font-bold">Performance</Text>
							</View>
						),
					}}
				/>
			</Stack>
		</NotificationProvider>
	);
}
