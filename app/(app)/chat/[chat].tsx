import Animated, { useAnimatedStyle, withSpring, withTiming, EntryAnimationsValues, EntryExitAnimationFunction, } from "react-native-reanimated";
import { createMessageQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { View, TextInput, FlatList, Text } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Pressable } from "react-native-gesture-handler";
import { getStorageUserInfos } from "@/utils/store";
import { useForm } from "@tanstack/react-form";
import { SendIcon } from "lucide-react-native";
import { queryClient } from "@/api/_queries";
import { Message } from "@/types/chat";
import { AppUser } from "@/types/user";
import { cn } from "@/utils/cn";
import React from "react";
import { z } from "zod";


const customEntering: EntryExitAnimationFunction = (targetValues: EntryAnimationsValues) => {
	"worklet";
	const animations = {
		transform: [
			{ scale: withSpring(1, { damping: 12, mass: 1, stiffness: 100 }) },
			{ translateY: withTiming(0, { duration: 300 }) },
		],
		opacity: withTiming(1, { duration: 300 }),
	};
	const initialValues = {
		transform: [{ scale: 0.8 }, { translateY: 10 }],
		opacity: 0,
	};
	return {
		initialValues,
		animations,
	};
};

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
			mutationLogin.mutate({
				app_user: appUser?.user.id || "",
				chat_room: chatId,
				message: value.message,
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
					{messages?.docs.length ? (
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
							data={messages.docs}
							renderItem={({ item, index }) => {
								return (
									<Item lastMessage={index === messages.docs.length - 1 ? true : false} item={item} appUser={appUser} />
								);
							}}
							// don't invert on empty list
							inverted={true}
						/>
					) : (
						<View className="flex-1 items-center justify-center">
							<Text className="text-gray-500">No messages</Text>
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

						<Pressable onPress={handleSubmit} disabled={mutationLogin.isPending}>
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
};

const Item = React.memo(({ lastMessage, item, appUser }: ItemProps) => {
	return (
		<Animated.View
			className={cn(
				item.app_user === appUser?.user.id ? "self-end" : "self-start",
				lastMessage && "mb-3",
				"flex-row gap-3 rounded-xl bg-green-500 px-2.5 py-2",
			)}
		>
			<Text className="self-start text-white">{item.message}</Text>
			<View className="self-end flex-row gap-1">
				<Text className="text-xs text-gray-200">
					{new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
				</Text>
				<Text className="text-xs text-gray-200">
					{new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
				</Text>
			</View>
		</Animated.View>
	);
});

// for debugging in react devtools
Item.displayName = "Item";
