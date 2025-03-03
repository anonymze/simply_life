import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";

import { Chat } from "../../components/chat";


export default function Page() {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	// Simulate loading state
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	// Error handling function
	const handleError = (error: Error) => {
		console.error("Chat error:", error);
		setHasError(true);
	};

	// Retry function
	const handleRetry = () => {
		setHasError(false);
		setIsLoading(true);

		// Simulate reloading
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	};

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center">
				<Stack.Screen options={{ title: "SimplyChat" }} />
				<ActivityIndicator size="large" color="#0000ff" />
				<Text className="mt-4 text-gray-600">Chargement du chat...</Text>
			</View>
		);
	}

	if (hasError) {
		return (
			<View className="flex-1 items-center justify-center p-4">
				<Stack.Screen options={{ title: "SimplyChat" }} />
				<Ionicons name="alert-circle" size={48} color="#ef4444" />
				<Text className="mb-4 mt-2 text-lg font-bold text-red-500">Something went wrong</Text>
				<Text className="mb-6 text-center text-gray-600">We're having trouble loading the chat. Please try again.</Text>
				<TouchableOpacity onPress={handleRetry} className="flex-row items-center rounded-full bg-blue-500 px-6 py-3">
					<Ionicons name="refresh" size={20} color="white" />
					<Text className="ml-2 font-medium text-white">Try Again</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
			<Chat onError={handleError} />
		</SafeAreaView>
	);
}
