import { View, TextInput, FlatList, Text, Platform, TouchableOpacity, Pressable } from "react-native";
import { CheckCheckIcon, CheckIcon, PaperclipIcon, SendIcon } from "lucide-react-native";
import { createMessageQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Message, MessageOptimistic } from "@/types/chat";
import { getStorageUserInfos } from "@/utils/store";
// import useWebSocket from "@/hooks/use-websocket";
import { useForm } from "@tanstack/react-form";
import { queryClient } from "@/api/_queries";
import config from "@/tailwind.config";
import { AppUser } from "@/types/user";
import { Image } from "expo-image";
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

	if (!chatId) {
		return <Redirect href="/chat" />;
	}

	const [maxMessages, setMaxMessages] = React.useState(MAX_MESSAGES);
	const appUser = React.useMemo(() => getStorageUserInfos(), []);
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
	const { height } = useReanimatedKeyboardAnimation();
	const bottomSafeAreaView = useSafeAreaInsets().bottom;

	// const onMessageWebsocket = (event: any) => {
	// 	const { data, success } = messageReceivedSchema.safeParse(JSON.parse(event));
	// 	if (!success) return;

	// 	queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] });
	// };

	// const websocketConnected = useWebSocket(chatId, onMessageWebsocket);

	const { data: messages, isLoading: loadingMessages } = useQuery({
		queryKey: ["messages", chatId, maxMessages],
		queryFn: getMessagesQuery,
		placeholderData: (prev) => prev,
		refetchInterval: 6000,
	});
	
	const mutationMessages = useMutation({
		mutationFn: createMessageQuery,
		// when mutate is called:
		onMutate: async (newMessage) => {
			// cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["messages", chatId, maxMessages] });

			// snapshot the previous value
			const previousMessages = queryClient.getQueryData(["messages", chatId, maxMessages]);

			// optimistically update to the new value
			queryClient.setQueryData(["messages", chatId, maxMessages], (old: Message[]) => {
				return [newMessage, ...old];
			});

			// return old messages before optimistic update for the context in onError
			return previousMessages;
		},
		// if the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(["messages", chatId, maxMessages], context);
		},
		// always refetch after error or success:
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] }),
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
				app_user: appUser?.user.id || "",
				chat_room: chatId,
				message: value.message,
				createdAt: new Date().toISOString(),
				// we flag it to show it as a pending message
				optimistic: true,
			});
		},
	});

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
							<FlatList<Message | MessageOptimistic>
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
									const lastMessageUser = messages[index + 1]?.app_user !== item.app_user;
									const newMessageUser = messages[index - 1]?.app_user !== item.app_user;
									return (
										<Item
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
								<TouchableOpacity onPress={() => {}} className="p-2.5">
									<PaperclipIcon size={17} color={config.theme.extend.colors.primaryLight} />
								</TouchableOpacity>
							</View>
							<Pressable
								onPress={handleSubmit}
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

type ItemProps = {
	firstMessage: boolean;
	item: Message | MessageOptimistic;
	appUser: AppUser | null;
	stateMessage: {
		newMessageUser: boolean;
		lastMessageUser: boolean;
	};
};

const Item = React.memo(({ firstMessage, item, appUser, stateMessage }: ItemProps) => {
	const me = item.app_user === appUser?.user.id;
	const optimistic = "optimistic" in item ? item.optimistic : false;

	return (
		<View
			className={cn(
				"my-[0.15rem] items-end gap-1",
				me ? "self-end" : "self-start",
				me ? "flex-row-reverse" : "flex-row",
				firstMessage && "mb-3",
				stateMessage.lastMessageUser && "mt-2.5",
			)}
		>
			<Image
				source={require("@/assets/icons/placeholder_user.svg")}
				style={{ width: 28, height: 28, borderRadius: 99 }}
			/>
			<View className={cn(me ? "bg-greenChat" : "bg-grayChat", "flex-shrink flex-row gap-3 rounded-xl px-2.5 py-2.5")}>
				<View className="flex-shrink gap-1">
					{!me && stateMessage.lastMessageUser && <Text className="text-sm font-bold text-primaryLight">User</Text>}
					<Text className="flex-shrink self-start text-white">{item.message}</Text>
				</View>
				<View className="flex-row gap-1 self-end">
					<Text className="text-xs text-gray-200">
						{new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
					</Text>
					{me &&
						(optimistic ? <CheckIcon size={14} color="#e5e5e5e5" /> : <CheckCheckIcon size={14} color="#55c0ff" />)}
				</View>
			</View>
		</View>
	);
});

// for debugging in react devtools
Item.displayName = "Item";
