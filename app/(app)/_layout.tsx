import { View, Text, Pressable, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getStorageUserInfos, storage } from "@/utils/store";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Link, Stack, Redirect } from "expo-router";


export default function AppLayout() {
	const userInfos = getStorageUserInfos();

	if (!userInfos || !userInfos.token) {
		return <Redirect href="/login" />;
	}

	return (
		<Stack
			initialRouteName="index"
			screenOptions={{
				headerShown: false,
				animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
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
				name="sponsors"
				options={{
					headerShown: true,
					gestureEnabled: true,
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
					headerShown: true,
					gestureEnabled: false,
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
		</Stack>
	);
}
