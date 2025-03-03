import { View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Text, RefreshControl, Keyboard, TouchableWithoutFeedback, } from "react-native";
import React, { useState, useRef, useEffect, useMemo } from "react";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import config from "@/tailwind.config";

import { ChatMessage, MessageType } from "./chat-message";
import { chatService } from "../services/chat-service";
import { cn } from "../utils/cn";


interface ChatProps {
	className?: string;
	onError?: (error: Error) => void;
}

// Helper to format date for timestamp headers
const formatDateHeader = (date: Date): string => {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	if (messageDate.getTime() === today.getTime()) {
		return "Today";
	} else if (messageDate.getTime() === yesterday.getTime()) {
		return "Yesterday";
	} else {
		return date.toLocaleDateString(undefined, {
			weekday: "long",
			month: "short",
			day: "numeric",
		});
	}
};

// Item type for the FlatList
type ChatItem = MessageType | { id: string; type: "header"; date: Date };

export function Chat({ className, onError }: ChatProps) {
	const [messages, setMessages] = useState<MessageType[]>(chatService.getInitialMessages());
	const [inputText, setInputText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const flatListRef = useRef<FlatList>(null);
	const inputRef = useRef<TextInput>(null);

	// Process messages to include date headers
	const chatItems = useMemo(() => {
		const items: ChatItem[] = [];
		let currentDateStr: string | null = null;

		// Sort messages by timestamp
		const sortedMessages = [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

		sortedMessages.forEach((message) => {
			const messageDate = new Date(
				message.timestamp.getFullYear(),
				message.timestamp.getMonth(),
				message.timestamp.getDate(),
			);
			const dateStr = formatDateHeader(messageDate);

			if (dateStr !== currentDateStr) {
				items.push({
					id: `header-${messageDate.getTime()}`,
					type: "header",
					date: messageDate,
				});
				currentDateStr = dateStr;
			}

			items.push(message);
		});

		return items;
	}, [messages]);

	// Scroll to bottom when messages change
	useEffect(() => {
		if (messages.length > 0) {
			setTimeout(() => {
				flatListRef.current?.scrollToEnd({ animated: true });
			}, 100);
		}
	}, [messages]);

	const handleSendMessage = async () => {
		if (inputText.trim() === "") return;

		// Dismiss keyboard
		Keyboard.dismiss();

		// Add user message
		const newUserMessage: MessageType = {
			id: Date.now().toString(),
			text: inputText,
			sender: "Me",
			timestamp: new Date(),
			isMe: true,
		};

		setMessages((prev) => [...prev, newUserMessage]);
		const userMessageText = inputText;
		setInputText("");

		// Show typing indicator
		setIsLoading(true);

		try {
			// Get response from chat service
			const response = await chatService.sendMessage(userMessageText);

			// Simulate typing delay
			await new Promise((resolve) => setTimeout(resolve, response.typingDelay));

			// Add bot response
			setMessages((prev) => [...prev, response.message]);
		} catch (error) {
			console.error("Error sending message:", error);
			// Add error message
			const errorMessage: MessageType = {
				id: Date.now().toString(),
				text: "Sorry, there was an error sending your message. Please try again.",
				sender: "System",
				timestamp: new Date(),
				isMe: false,
			};
			setMessages((prev) => [...prev, errorMessage]);

			// Call onError if provided
			if (onError && error instanceof Error) {
				onError(error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleRefresh = async () => {
		// Dismiss keyboard
		Keyboard.dismiss();

		setRefreshing(true);
		try {
			// Simulate refreshing the chat
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Reset to initial messages
			setMessages(chatService.getInitialMessages());
		} catch (error) {
			console.error("Error refreshing chat:", error);
			if (onError && error instanceof Error) {
				onError(error);
			}
		} finally {
			setRefreshing(false);
		}
	};

	// Render item for FlatList
	const renderItem = ({ item }: { item: ChatItem }) => {
		// Render date header
		if ("type" in item && item.type === "header") {
			return (
				<Animated.View entering={FadeIn} layout={Layout} className="my-2 items-center justify-center">
					<View className="rounded-full bg-gray-100 px-4 py-1">
						<Text className="text-xs font-medium text-gray-500">{formatDateHeader(item.date)}</Text>
					</View>
				</Animated.View>
			);
		}

		// Render message - we know it's a MessageType at this point
		return (
			<Animated.View entering={FadeIn} layout={Layout}>
				<ChatMessage message={item as MessageType} />
			</Animated.View>
		);
	};

	return (
		<KeyboardAvoidingView
			behavior={"padding"}
			className={cn("flex-1", className)}
			keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className="flex-1 bg-background">
					{messages.length === 0 ? (
						<View className="flex-1 items-center justify-center">
							<Text className="text-gray-500">No messages yet</Text>
						</View>
					) : (
						<FlatList
							ref={flatListRef}
							data={chatItems}
							keyExtractor={(item) => item.id}
							renderItem={renderItem}
							contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
							showsVerticalScrollIndicator={true}
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={handleRefresh}
									colors={[config.theme.extend.colors.primary]}
									tintColor={config.theme.extend.colors.primary}
								/>
							}
							keyboardShouldPersistTaps="handled"
							initialNumToRender={20}
							maxToRenderPerBatch={20}
							windowSize={21}
							onEndReachedThreshold={0.5}
							removeClippedSubviews={false}
							maintainVisibleContentPosition={{
								minIndexForVisible: 0,
								autoscrollToTopThreshold: 10,
							}}
						/>
					)}

					{isLoading && (
						<View className="absolute bottom-20 left-4 flex-row items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
							<ActivityIndicator size="small" color={config.theme.extend.colors.primary} />
							<Text className="text-sm text-gray-600">ChatBot écrit...</Text>
						</View>
					)}

					<View className="border-t border-gray-200 bg-white px-4 pt-3">
						<View className="flex-row items-center gap-3">
							<TextInput
								ref={inputRef}
								className="flex-1 rounded-3xl bg-gray-100 px-6 py-4"
								placeholder="Envoyer un message..."
								value={inputText}
								onChangeText={setInputText}
								multiline
								maxLength={500}
								onSubmitEditing={handleSendMessage}
								returnKeyType="next"
								autoCapitalize="none"
								autoCorrect={false}
								autoComplete="off"
							/>
							<TouchableOpacity
								onPress={handleSendMessage}
								disabled={inputText.trim() === "" || isLoading}
								className={cn(
									"h-10 w-10 items-center justify-center rounded-full",
									
								)}
								style={{
									backgroundColor: inputText.trim() === "" || isLoading ? "gray" : config.theme.extend.colors.primary,
								}}
							>
								<Ionicons name="send" size={18} color="white" />
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
