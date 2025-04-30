import { createMessageQuery, createMessageWithFilesQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { View, TextInput, Text, Platform, TouchableOpacity, Pressable, Alert } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { ImageIcon, PaperclipIcon, SendIcon } from "lucide-react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { UIImagePickerPresentationStyle } from "expo-image-picker";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Message, MessageOptimistic } from "@/types/chat";
import { FlatList } from "react-native-gesture-handler";
import { getStorageUserInfos } from "@/utils/store";
import * as ImagePicker from "expo-image-picker";
// import useWebSocket from "@/hooks/use-websocket";
import { useForm } from "@tanstack/react-form";
import { Item } from "@/components/item-chat";
import { queryClient } from "@/api/_queries";
import config from "@/tailwind.config";
import { cn } from "@/utils/cn";
import React from "react";
import { z } from "zod";

import { MAX_MESSAGES } from "./index";


// const messageReceivedSchema = z.object({
// 	type: z.literal("MESSAGE_RECEIVED"),
// 	message: z.any(),
// });

export default function Page() {
	const { chat: chatId } = useLocalSearchParams<{ chat?: string }>();
	const appUser = React.useMemo(() => getStorageUserInfos(), []);

	if (!chatId || !appUser) {
		return <Redirect href="/chat" />;
	}

	const [maxMessages, setMaxMessages] = React.useState(MAX_MESSAGES);
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
	const { height } = useReanimatedKeyboardAnimation();
	const bottomSafeAreaView = useSafeAreaInsets().bottom;

	const mutateMessages = React.useCallback(
		async (newMessage: MessageOptimistic) => {
			console.log("mutateMessages", newMessage);
			// cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["messages", chatId, maxMessages] });

			// snapshot the previous value
			const previousMessages = queryClient.getQueryData(["messages", chatId, maxMessages]);

			if (newMessage.file) {
				const newMessages = newMessage.file.map((file) => ({
					...newMessage,
					id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
					file: file,
				}));

				// optimistically update to the new value
				queryClient.setQueryData(["messages", chatId, maxMessages], (old: Message[]) => {
					return [...newMessages, ...old];
				});
			} else {
				// optimistically update to the new value
				queryClient.setQueryData(["messages", chatId, maxMessages], (old: Message[]) => {
					return [newMessage, ...old];
				});
			}

			// return old messages before optimistic update for the context in onError
			return previousMessages;
		},
		[chatId, maxMessages],
	);

	const mutationMessages = useMutation({
		mutationFn: createMessageQuery,
		// when mutate is called:
		onMutate: mutateMessages,
		// if the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			Alert.alert(i18n[languageCode]("ERROR_GENERIC_PART1"), err.message);
			queryClient.setQueryData(["messages", chatId, maxMessages], context);
		},
		// always refetch after error or success:
		onSettled: () => {
			if (mutationMessagesFile.isPending) return;
			queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] });
		},
		onSuccess: () => {
			console.log("success");
		},
	});

	const mutationMessagesFile = useMutation({
		mutationFn: createMessageWithFilesQuery,
		onMutate: mutateMessages,
		onError: (err, newMessage, context) => {
			Alert.alert(i18n[languageCode]("ERROR_GENERIC_PART1"), err.message);
			queryClient.setQueryData(["messages", chatId, maxMessages], context);
		},
		onSettled: () => {
			if (mutationMessages.isPending) return;
			queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] });
		},
	});

	const { data: messages, isLoading: loadingMessages } = useQuery({
		queryKey: ["messages", chatId, maxMessages],
		queryFn: getMessagesQuery,
		placeholderData: (prev) => prev,
		refetchInterval: () => {
			// pause refetching while a message is being sent
			if (mutationMessages.isPending || mutationMessagesFile.isPending) return false;
			return 6000;
		},
	});

	const formSchema = React.useMemo(
		() =>
			z.object({
				// prevent only white spaces
				message: z.string().regex(/.*\S.*/),
			}),
		[],
	);

	const form = useForm({
		defaultValues: {
			message: "",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			form.reset();

			// we have to set an id otherwise the list will not have a key extractor, and a date to show
			mutationMessages.mutate({
				id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
				app_user: appUser.user,
				chat_room: chatId,
				message: value.message,
				createdAt: new Date().toISOString(),
				// we flag it to show it as a pending message
				optimistic: true,
			});
		},
	});

	const pickImage = React.useCallback(async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images", "videos"],
			allowsEditing: false,
			aspect: [1, 1],
			quality: 0.4,
			allowsMultipleSelection: true,
			presentationStyle: UIImagePickerPresentationStyle.POPOVER,
		});

		if (result.canceled) return;

		mutationMessagesFile.mutate({
			// id is set later (to have differents ids for each file)
			id: "",
			app_user: appUser.user,
			chat_room: chatId,
			file: result.assets,
			createdAt: new Date().toISOString(),
			// we flag it to show it as a pending message
			optimistic: true,
		});
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		const spacing = 12;
		return {
			transform: [{ translateY: height.value ? height.value + bottomSafeAreaView - spacing : 0 }],
			// otherwise the top of the list is cut
			marginTop: height.value ? -(height.value + bottomSafeAreaView - spacing) : 0,
		};
	});

	const handleSubmit = React.useCallback(() => {
		// delay to the next frame to avoid autocorrect messing up
		requestAnimationFrame(() => {
			form.handleSubmit();
		});
	}, [form]);

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
			<Stack.Screen options={{ title: chatId }} />

			<BackgroundLayout className="px-6">
				{/* <View className={cn("absolute left-4 top-4 size-4 bg-red-500", websocketConnected && "bg-green-500")} /> */}
				<Animated.View className="flex-1" style={animatedStyle}>
					<View className="flex-1">
						{!!messages?.length ? (
							<FlatList<Message>
								contentContainerStyle={
									{
										// gap: 5,
										// width: "100%",
										// needed for list empty
										// flex: messages?.docs.length ? undefined : 1,
									}
								}
								// ListEmptyComponent={() => {
								// 	return (
								// 		<View className="flex-1 items-center justify-center">
								// 			<Text className="text-gray-500">Pas de message</Text>
								// 		</View>
								// 	);
								// }}
								keyExtractor={(item) => item.id}
								showsVerticalScrollIndicator={false}
								data={messages}
								renderItem={({ item, index }) => {
									const lastMessageUser = messages[index + 1]?.app_user.id !== item.app_user.id;
									const newMessageUser = messages[index - 1]?.app_user.id !== item.app_user.id;
									return (
										<Item
											languageCode={languageCode}
											stateMessage={{
												lastMessageUser,
												newMessageUser,
											}}
											firstMessage={index === 0 ? true : false}
											item={item}
											appUser={appUser}
										/>
									);
								}}
								// don't invert on empty list
								inverted={true}
								onEndReached={() => {
									// add more messages when on end scroll
									if (!!messages.length && messages.length >= maxMessages) {
										setMaxMessages((props) => props + 20);
									}
								}}
								onEndReachedThreshold={0.2}
							/>
						) : (
							<View className="flex-1 items-center justify-center">
								{loadingMessages ? (
									<Text className="text-gray-500">Chargement...</Text>
								) : (
									<Text className="text-gray-500">Pas de message</Text>
								)}
							</View>
						)}

						<View className="flex-row items-center gap-0.5">
							<View
								className={cn(
									"flex-shrink flex-row items-center rounded-2xl border border-gray-300",
									Platform.OS === "android" && "mb-3",
								)}
							>
								<form.Field name="message">
									{(field) => (
										<TextInput
											placeholderTextColor={config.theme.extend.colors.lightGray}
											returnKeyType="default"
											autoCapitalize="none"
											keyboardType="default"
											submitBehavior="newline"
											multiline={true}
											placeholder={`${i18n[languageCode]("MESSAGE")}...`}
											className="flex-1 p-3 pr-0"
											onChangeText={field.handleChange}
											defaultValue={field.state.value}
										/>
									)}
								</form.Field>
								<TouchableOpacity onPress={pickImage} className="px-2 py-2.5">
									<ImageIcon size={18} color={config.theme.extend.colors.primaryLight} />
								</TouchableOpacity>
								<TouchableOpacity onPress={() => {}} className="py-2.5 pl-2 pr-2.5">
									<PaperclipIcon size={17} color={config.theme.extend.colors.primaryLight} />
								</TouchableOpacity>
							</View>
							<Pressable
								onPress={handleSubmit}
								disabled={loadingMessages}
								style={{
									opacity: loadingMessages ? 0.5 : 1,
								}}
								className={cn("p-1.5 pr-0.5", Platform.OS === "android" && "mb-3")}
							>
								<SendIcon size={20} color={config.theme.extend.colors.primaryLight} />
							</Pressable>
						</View>
					</View>
				</Animated.View>
			</BackgroundLayout>
		</SafeAreaView>
	);
}

// const onMessageWebsocket = (event: any) => {
// 	const { data, success } = messageReceivedSchema.safeParse(JSON.parse(event));
// 	if (!success) return;

// 	queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] });
// };

// const websocketConnected = useWebSocket(chatId, onMessageWebsocket);
