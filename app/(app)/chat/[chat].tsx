import Animated, { useAnimatedStyle, withSpring, withTiming, EntryAnimationsValues, EntryExitAnimationFunction, } from "react-native-reanimated";
import { createMessageQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCheckIcon, CheckIcon, SendIcon } from "lucide-react-native";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { View, TextInput, FlatList, Text } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Pressable } from "react-native-gesture-handler";
import { getStorageUserInfos } from "@/utils/store";
import { useForm } from "@tanstack/react-form";
import { queryClient } from "@/api/_queries";
import { Message } from "@/types/chat";
import { AppUser } from "@/types/user";
import { cn } from "@/utils/cn";
import React from "react";
import { z } from "zod";


export default function Page() {
	const [maxMessages, setMaxMessages] = React.useState(25);
	const { chat: chatId } = useLocalSearchParams<{ chat?: string }>();
	const { height } = useReanimatedKeyboardAnimation();
	const appUser = React.useMemo(() => getStorageUserInfos(), []);
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
	const bottomSafeAreaView = useSafeAreaInsets().bottom;

	if (!chatId) {
		return <Redirect href="/chat" />;
	}

	const { data: messages } = useQuery({
		queryKey: ["messages", chatId],
		queryFn: getMessagesQuery,
		// we don't want to cache the messages, we want to show the latest messages instantly
		staleTime: 0,
	});

	const mutationLogin = useMutation({
		mutationFn: createMessageQuery,
		// when mutate is called:
		onMutate: async (newMessage) => {
			// cancel any outgoing refetches
			// (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["messages", chatId] });

			// snapshot the previous value
			const previousMessages = queryClient.getQueryData(["messages", chatId]);

			// optimistically update to the new value
			queryClient.setQueryData(["messages", chatId], (old: Message[]) => {
				return [...old, newMessage];
			});

			// return old messages before optimistic update for the context in onError
			return previousMessages;
		},
		// if the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, newMessage, context) => {
			queryClient.setQueryData(['messages', chatId], context);
		},
		// always refetch after error or success:
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["messages", chatId] }),
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
			<BackgroundLayout className="px-6">
				<Stack.Screen options={{ title: chatId }} />
				<Animated.View className="flex-1" style={animatedStyle}>
					{messages?.length ? (
						<FlatList
							contentContainerStyle={{
								flexDirection: "column-reverse",
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
									<Item optimistic={item.optimistic} lastMessage={index === messages.length - 1 ? true : false} item={item} appUser={appUser} />
								);
							}}
							// don't invert on empty list
							inverted={true}
						/>
					) : (
						<View className="flex-1 items-center justify-center">
							<Text className="text-gray-500">Pas de message</Text>
						</View>
					)}

					<View className="flex-row items-center gap-2 rounded-2xl border border-gray-300 p-3">
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

						<Pressable onPress={handleSubmit}>
							<SendIcon size={24} color="#666" />
						</Pressable>
					</View>
				</Animated.View>
			</BackgroundLayout>
		</SafeAreaView>
	);
}

type ItemProps = {
	lastMessage: boolean;
	item: Message;
	appUser: AppUser | null;
	optimistic?: boolean;
};

const Item = React.memo(({ lastMessage, item, appUser, optimistic }: ItemProps) => {
	return (
		<Animated.View
			className={cn(
				item.app_user === appUser?.user.id ? "self-end" : "self-start",
				lastMessage && "mb-3",
				"flex-row gap-3 rounded-xl bg-green-500 px-2.5 py-2",
			)}
		>
			<Text className="self-start text-white">{item.message}</Text>
			<View className="flex-row gap-1 self-end">
				<Text className="text-xs text-gray-200">
					{new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
				</Text>
				{optimistic ? (
					<CheckIcon style={{ alignSelf: "flex-end" }} size={13} color="#e5e5e5e5" />
				) : (
					<CheckCheckIcon size={13} color="#e5e5e5e5" />
				)}
			</View>
		</Animated.View>
	);
});

// for debugging in react devtools
Item.displayName = "Item";
