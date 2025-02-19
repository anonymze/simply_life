import 'react-native-reanimated';
import "@/styles/app.css";

import { Stack } from "expo-router";
import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {
<GestureHandlerRootView>
			<StatusBar style="light" translucent />
			<SafeAreaProvider>
				<SafeAreaView
					edges={["right", "left", "top"]}
					
				>
					<Stack
					
						screenOptions={{
							headerShown: false,
							animation: "none",
						}}
					>
						<Stack.Screen options={{ animation: "fade_from_bottom" }}  name="recipe" />
					</Stack>
				</SafeAreaView>
			</SafeAreaProvider>
		</GestureHandlerRootView>
}
