import { View, TextInput, Text, Platform, TouchableOpacity, Pressable, Alert, ActivityIndicator } from "react-native";
import { CheckCheckIcon, CheckIcon, PaperclipIcon, SendIcon } from "lucide-react-native";
import { createMessageQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, useAnimatedStyle } from "react-native-reanimated";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { UIImagePickerPresentationStyle } from "expo-image-picker";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { createMediaQuery } from "@/api/queries/media-queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Message, MessageOptimistic } from "@/types/chat";
import { FlatList } from "react-native-gesture-handler";
import { getStorageUserInfos } from "@/utils/store";
import * as ContextMenu from "zeego/context-menu";
import * as ImagePicker from "expo-image-picker";
// import useWebSocket from "@/hooks/use-websocket";
import { useForm } from "@tanstack/react-form";
import { queryClient } from "@/api/_queries";
import { Dimensions } from "react-native";
import config from "@/tailwind.config";
import { AppUser } from "@/types/user";
import { Media } from "@/types/media";
import { I18n } from "@/types/i18n";
import { Image } from "expo-image";
import { cn } from "@/utils/cn";
import React from "react";
import { z } from "zod";

import { MAX_MESSAGES } from "./index";


const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

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
			Alert.alert(i18n[languageCode]("ERROR_GENERIC_PART1"), err.message);
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

	const mutationMedia = useMutation({
		mutationFn: createMediaQuery,
		onSuccess: (data) => {
			mutationMessages.mutate({
				id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
				app_user: appUser.user,
				chat_room: chatId,
				// todo all files
				file: data[0].doc.id,
				createdAt: new Date().toISOString(),
				optimistic: true,
			});
		},
		onError: (_) => {
			Alert.alert(i18n[languageCode]("ERROR_GENERIC_PART1"), i18n[languageCode]("ERROR_GENERIC_PART2"));
		},
	});

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
			quality: 0.5,
			allowsMultipleSelection: true,
			presentationStyle: UIImagePickerPresentationStyle.POPOVER,
		});

		if (result.canceled) return;

		mutationMedia.mutate(result.assets);
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
								<TouchableOpacity onPress={pickImage} className="p-2.5">
									<PaperclipIcon size={17} color={config.theme.extend.colors.primaryLight} />
								</TouchableOpacity>
							</View>
							{mutationMedia.isPending ? (
								<ActivityIndicator
									className="p-1.5 pr-0.5"
									size="small"
									color={config.theme.extend.colors.primaryLight}
								/>
							) : (
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
							)}
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
	languageCode: I18n;
};

const Item = React.memo(({ firstMessage, item, appUser, stateMessage, languageCode }: ItemProps) => {
	const me = item.app_user.id === appUser?.user.id;
	const optimistic = "optimistic" in item ? true : false;

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
			{!me && (
				<Image
					placeholderContentFit="contain"
					placeholder={require("@/assets/icons/placeholder_user.svg")}
					source={item.app_user.photo?.url}
					style={{ width: 28, height: 28, borderRadius: 99, objectFit: "contain" }}
				/>
			)}
			<View
				className={cn(
					"flex-shrink flex-row gap-3 rounded-xl p-2.5",
					me ? "bg-greenChat" : "bg-grayChat",
					item.file && "p-1.5",
				)}
			>
				<View className="flex-shrink gap-1">
					{!me && stateMessage.lastMessageUser && (
						<Text className="text-sm font-bold text-primaryLight">{`${item.app_user.firstname} ${item.app_user.lastname}`}</Text>
					)}
					{item.message && <Text className="flex-shrink self-start text-white">{item.message}</Text>}
					{item.file ? (
						optimistic ? (
							<ActivityIndicator size="small" style={{ width: 140, height: 180, borderRadius: 6 }} color="#fff" />
						) : (
							<ContextMenu.Root>
								<ContextMenu.Trigger>
									<Animated.View style={{ width: 140, height: 180, borderRadius: 6 }} entering={FadeIn.duration(400)}>
										<Image
											placeholder={(item.file as Media).blurhash}
											placeholderContentFit="cover"
											source={(item.file as Media).url}
											transition={300}
											contentFit="cover"
											style={{ width: 140, height: 180, borderRadius: 6 }}
										/>
									</Animated.View>
								</ContextMenu.Trigger>
								<ContextMenu.Content>
									<ContextMenu.Preview>
										<Image
											source={(item.file as Media).url}
											contentFit="cover"
											style={{ width: width, height: height / 1.8, borderRadius: 6 }}
										/>
									</ContextMenu.Preview>
									{/* <ContextMenu.Label>Actions</ContextMenu.Label> */}
									<ContextMenu.Item
										key="download"
										onSelect={() => {
											console.log("download");
										}}
									>
										<ContextMenu.ItemTitle>{i18n[languageCode]("DOWNLOAD")}</ContextMenu.ItemTitle>
										<ContextMenu.ItemIcon
											// androidIconName="arrow_down_float"
											ios={{
												name: "arrow.down", // required
												pointSize: 15,
												weight: "semibold",
												// scale: "medium",
												// can also be a color string. Requires iOS 15+
												// hierarchicalColor: {
												// 	dark: "blue",
												// 	light: "green",
												// },
												// alternative to hierarchical color. Requires iOS 15+
												paletteColors: [
													{
														dark: config.theme.extend.colors.primaryLight,
														light: config.theme.extend.colors.primaryLight,
													},
												],
											}}
										/>
									</ContextMenu.Item>
								</ContextMenu.Content>
							</ContextMenu.Root>
						)
					) : null}
				</View>
				<View className={cn("flex-row gap-1 self-end", item.file && "absolute bottom-2 right-2")}>
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

// const onMessageWebsocket = (event: any) => {
// 	const { data, success } = messageReceivedSchema.safeParse(JSON.parse(event));
// 	if (!success) return;

// 	queryClient.invalidateQueries({ queryKey: ["messages", chatId, maxMessages] });
// };

// const websocketConnected = useWebSocket(chatId, onMessageWebsocket);
