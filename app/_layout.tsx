import "react-native-reanimated";
import "@/styles/app.css";

import { Text, View, Pressable, Platform, AppState, AppStateStatus } from "react-native";
import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { onlineManager } from "@tanstack/react-query";
import { SimpleLineIcons } from "@expo/vector-icons";
import { focusManager } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { Link, router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Network from "expo-network";
import { useFonts } from "expo-font";
import React from "react";


// refetch on network change
onlineManager.setEventListener((setOnline) => {
	const eventSubscription = Network.addNetworkStateListener((state) => {
		setOnline(!!state.isConnected);
	});
	return eventSubscription.remove;
});

// refetch on app focus
function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

export default function RootLayout() {
	const [loaded] = useFonts({
		// AtkinsonRegular: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Regular-102a.woff2"),
		// AtkinsonBold: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Bold-102a.woff2"),
		// AtkinsonItalic: require("@/assets/fonts/atkinson/Atkinson-Hyperlegible-Italic-102a.woff2"),
	});

	React.useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	// refetch on app focus
	React.useEffect(() => {
		const subscription = AppState.addEventListener("change", onAppStateChange);
		return () => subscription.remove();
	}, []);

	return (
		<GestureHandlerRootView>
			<StatusBar style="light" translucent />
			<SafeAreaProvider>
				<SafeAreaView className="flex-1 bg-primaryLight" edges={["right", "left", "top"]}>
					<Stack
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
						<Stack.Screen name="index" options={{ gestureEnabled: false }} />
						<Stack.Screen
							name="sponsors"
							options={{
								headerShown: true,
								gestureEnabled: true,
								header: (_) => {
									return (
										<View className="w-full gap-5 rounded-xl bg-white p-4">
											<View className="items-center justify-center">
												<Link href="../" asChild>
													<Pressable className="absolute left-0 p-4 active:opacity-70">
														<SimpleLineIcons name="arrow-left" size={20} color="black" />
													</Pressable>
												</Link>

												<Text className="text-lg font-bold">Sponsors</Text>
											</View>
											<View className="flex-row items-center gap-4">
												<TextInput
													autoCorrect={false}
													autoCapitalize="none"
													className="basis-8/12 rounded-xl bg-gray-100 p-4"
													placeholder="Rechercher..."
												/>
												<Pressable className="grow rounded-xl bg-dark p-4">
													<Text className="font-bold text-white">Catégories</Text>
												</Pressable>
											</View>
										</View>
									);
								},
							}}
						/>
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
