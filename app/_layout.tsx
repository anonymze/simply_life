import "react-native-reanimated";
import "@/styles/app.css";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";


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
	return (
		<GestureHandlerRootView>
			<StatusBar style="dark" translucent />
			<SafeAreaProvider>
				<SafeAreaView className="flex-1" edges={["right", "left", "top"]}>
					<Stack
						screenOptions={{
							headerShown: false,
							animation: "none",
						}}
					/>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
