import "react-native-reanimated";
import "@/styles/app.css";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import React from "react";


export default function RootLayout() {
	<GestureHandlerRootView>
		<StatusBar style="light" translucent />
		<SafeAreaProvider>
			<SafeAreaView edges={["right", "left", "top"]}>
				<Stack
					screenOptions={{
						headerShown: false,
						animation: "none",
					}}
				>
				</Stack>
			</SafeAreaView>
		</SafeAreaProvider>
	</GestureHandlerRootView>;
}
