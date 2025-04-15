import { createMessageQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, TextInput, FlatList, Text, Pressable } from "react-native";
import { CheckCheckIcon, CheckIcon, SendIcon } from "lucide-react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Message, MessageOptimistic } from "@/types/chat";
import { getStorageUserInfos } from "@/utils/store";
import useWebSocket from "@/hooks/use-websocket";
import { useForm } from "@tanstack/react-form";
import { queryClient } from "@/api/_queries";
import { AppUser } from "@/types/user";
import { cn } from "@/utils/cn";
import React from "react";
import { z } from "zod";

import { MAX_MESSAGES } from "./index";


export default function Page() {
	const onMessageWebsocket = (messageEvent: any) => {
		console.log("WebsocketmessageEvent", messageEvent);
	};

	const onErrorWebsocket = (error: Event) => {
		console.error("WebSocket error:", error);
	};

	const onCloseWebsocket = (event: CloseEvent) => {
		console.log("WebSocket closed:", event);
	};	

	const websocketConnected = useWebSocket(onMessageWebsocket, onErrorWebsocket, onCloseWebsocket);
	const [maxMessages, setMaxMessages] = React.useState(MAX_MESSAGES);
	const { chat: chatId } = useLocalSearchParams<{ chat?: string }>();
	const appUser = React.useMemo(() => getStorageUserInfos(), []);
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
	// const { height } = useReanimatedKeyboardAnimation();
	// const bottomSafeAreaView = useSafeAreaInsets().bottom;

	if (!chatId) {
		return <Redirect href="/chat" />;
	}

	const { data: messages } = useQuery({
		queryKey: ["messages", chatId, maxMessages],
		queryFn: getMessagesQuery,
		// we don't want to cache the messages, we want to show the latest messages instantly
		staleTime: 0,
		// keep previous data while fetching
		placeholderData: (prev) => prev,
	});

	const mutationLogin = useMutation({
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
			mutationLogin.mutate({
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

	// const animatedStyle = useAnimatedStyle(() => {
	// 	const spacing = 12;
	// 	return {
	// 		transform: [{ translateY: height.value ? height.value + bottomSafeAreaView - spacing : 0 }],
	// 		// otherwise the top of the list is cut
	// 		marginTop: height.value ? -(height.value + bottomSafeAreaView - spacing) : 0,
	// 	};
	// });

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
				<View className={cn("absolute top-4 left-4 size-4 bg-red-500", websocketConnected && "bg-green-500")}/>
				{/* <Animated.View className="flex-1" style={animatedStyle}> */}
				<View className="flex-1">
					{messages?.length ? (
						<FlatList<Message | MessageOptimistic>
							contentContainerStyle={{
								gap: 5,
								// needed for list empty
								// flex: messages?.docs.length ? undefined : 1,
							}}
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
								return (
									//@ts-ignore
									<Item
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
								setMaxMessages((props) => props + 20);
							}}
							onEndReachedThreshold={0.2}
						/>
					) : (
						<View className="flex-1 items-center justify-center">
							<Text className="text-gray-500">Pas de message</Text>
						</View>
					)}

					<View className="flex-row items-center gap-2 rounded-2xl border border-gray-300 p-2 pl-3">
						<form.Field name="message">
							{(field) => (
								<TextInput
									returnKeyType="default"
									autoCapitalize="none"
									keyboardType="default"
									submitBehavior="newline"
									multiline={true}
									placeholder={`${i18n[languageCode]("MESSAGE")}...`}
									className="flex-1 p-0"
									onChangeText={field.handleChange}
									defaultValue={field.state.value}
								/>
							)}
						</form.Field>

						<Pressable onPress={handleSubmit} className="p-1.5">
							<SendIcon size={20} color="#666" />
						</Pressable>
					</View>
				</View>
				{/* </Animated.View> */}
			</BackgroundLayout>
		</SafeAreaView>
	);
}

type ItemProps = {
	firstMessage: boolean;
	item: Message | MessageOptimistic;
	appUser: AppUser | null;
};

const Item = React.memo(({ firstMessage, item, appUser }: ItemProps) => {
	const me = item.app_user === appUser?.user.id;
	const optimistic = "optimistic" in item ? item.optimistic : false;

	return (
		<View
			className={cn(
				me ? "self-end" : "self-start",
				me ? "bg-green-600" : "bg-gray-600",
				firstMessage && "mb-3",
				"flex-row gap-3 rounded-xl px-2.5 py-2",
			)}
		>
			<Text className="self-start text-white">{item.message}</Text>
			<View className="flex-row gap-1 self-end">
				<Text className="text-xs text-gray-200">
					{new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
				</Text>
				{me &&
					(optimistic ? (
						<CheckIcon style={{ alignSelf: "flex-end" }} size={14} color="#e5e5e5e5" />
					) : (
						<CheckCheckIcon size={14} color="#55c0ff" />
					))}
			</View>
		</View>
	);
});

// for debugging in react devtools
Item.displayName = "Item";
