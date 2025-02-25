import "react-native-reanimated";
import "@/styles/app.css";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { onlineManager, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, AppState, AppStateStatus } from "react-native";
import { focusManager } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { queryClient } from "@/api/_queries";
import { StatusBar } from "expo-status-bar";
import * as Network from "expo-network";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
	fade: true,
	duration: 300,
});

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
		if (loaded) SplashScreen.hideAsync();
	}, [loaded]);

	// refetch on app focus
	React.useEffect(() => {
		const subscription = AppState.addEventListener("change", onAppStateChange);
		return () => subscription.remove();
	}, []);

	if (!loaded) return null;

	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView>
				<StatusBar style="light" translucent />
				<SafeAreaProvider>
					<SafeAreaView className="flex-1 bg-primaryLight" edges={["right", "left", "top"]}>
						<Stack
							screenOptions={{
								headerShown: false,
								animation: Platform.OS === "ios" ? "simple_push" : "fade_from_bottom",
								gestureEnabled: false,
								fullScreenGestureEnabled: false,
							}}
						>
							<Stack.Screen name="login" />
						</Stack>
					</SafeAreaView>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
