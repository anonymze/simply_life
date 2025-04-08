import Animated, { FadeIn, FadeOut, useAnimatedStyle } from "react-native-reanimated";
import { createMessageQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, TextInput, FlatList, Text, LayoutAnimation } from "react-native";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Pressable } from "react-native-gesture-handler";
import { getStorageUserInfos } from "@/utils/store";
import React, { useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { SendIcon } from "lucide-react-native";
import { queryClient } from "@/api/_queries";
import { Message } from "@/types/chat";
import { AppUser } from "@/types/user";
import { cn } from "@/utils/cn";
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
		queryKey: ["messages", chatId, maxMessages],
		queryFn: getMessagesQuery,
	});

	const mutationLogin = useMutation({
		mutationFn: createMessageQuery,
		onError: (error) => {
			console.log(error);
		},
		onSuccess: async (data) => {
			queryClient.invalidateQueries({ queryKey: ["messages"] });
		},
	});

	const formSchema = React.useMemo(
		() =>
			z.object({
				// prevent only white spaces
				message: z.string().regex(/.*\S.*/, "Message cannot be only whitespace"),
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
			mutationLogin.mutate({
				app_user: appUser?.user.id || "",
				chat_room: chatId,
				message: value.message,
			});
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: height.value ? height.value + bottomSafeAreaView - 12 : 0 }],
			marginTop: height.value ? -(height.value + bottomSafeAreaView - 12) : 0,
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
						// 			<Text className="text-gray-500">No messages</Text>
						// 		</View>
						// 	);
						// }}
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						data={messages?.docs || []}
						renderItem={({ item, index }) => {
							return (
								<Item
									lastMessage={messages?.docs.length && index === messages.docs.length - 1 ? true : false}
									item={item}
									appUser={appUser}
								/>
							);
						}}
						// don't invert on empty list
						inverted={true}
					/>

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

						<Pressable onPress={handleSubmit} disabled={mutationLogin.isPending}>
							<SendIcon size={24} color="#666" />
						</Pressable>
					</View>
				</Animated.View>
			</BackgroundLayout>
		</SafeAreaView>
	);
}

const Item = ({ lastMessage, item, appUser }: { lastMessage: boolean; item: Message; appUser: AppUser | null }) => {
	return (
		<Animated.View
			entering={FadeIn.duration(300)}
			exiting={FadeOut.duration(300)}
			className={cn(
				item.app_user === appUser?.user.id ? "self-end" : "self-start",
				lastMessage && "mb-3",
				"rounded-xl bg-green-500 px-4 py-2",
			)}
		>
			<Text className="text-white">{item.message}</Text>
		</Animated.View>
	);
};
