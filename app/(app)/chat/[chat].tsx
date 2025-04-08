import { createMessageQuery, getMessagesQuery } from "@/api/queries/message-queries";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { View, Text, TextInput, Dimensions } from "react-native";
import { useMutation, useQuery } from "@tanstack/react-query";
import BackgroundLayout from "@/layouts/background-layout";
import { Pressable } from "react-native-gesture-handler";
import { getStorageUserInfos } from "@/utils/store";
import { FlashList } from "@shopify/flash-list";
import { useForm } from "@tanstack/react-form";
import { SendIcon } from "lucide-react-native";
import { queryClient } from "@/api/_queries";
import { cn } from "@/utils/cn";
import React from "react";
import { z } from "zod";


const { height: screenHeight, width: windowWidth } = Dimensions.get("window");

// utility function to estimate text height
const estimateTextHeight = (text: string, containerWidth: number) => {
	// base height for padding + margins (py-2 = 16, my-1 = 8)
	const basePadding = 19;

	// average character width (approximation)
	const averageCharWidth = 8;

	// available width for text (container width - horizontal padding)
	const textWidth = containerWidth - 32; // px-4 = 32

	// calculate how many characters fit per line
	const charsPerLine = Math.floor(textWidth / averageCharWidth);

	// count line breaks
	const explicitLineBreaks = (text.match(/\n/g) || []).length;

	// calculate wrapped lines
	const wrappedLines = Math.ceil(text.length / charsPerLine);

	// total lines
	const totalLines = Math.max(1, wrappedLines + explicitLineBreaks);

	// line height (approximation)
	const lineHeight = 20;

	return basePadding + totalLines * lineHeight;
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
			// console.log(data);
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
		};
	});

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
			<BackgroundLayout className="px-6">
				<Stack.Screen options={{ title: chatId }} />
				<Animated.View className="flex-1" style={animatedStyle}>
					<FlashList
						keyExtractor={(item) => item.id}
						initialScrollIndex={messages?.docs.length ? messages.docs.length - 1 : 0}
						showsVerticalScrollIndicator={false}
						data={messages?.docs || []}
						renderItem={({ item }) => {
							return (
								<View
									className={cn(
										item.app_user === appUser?.user.id ? "self-end" : "self-start",
										"rounded-xl bg-green-500 px-4 py-2",
										"my-1",
									)}
								>
									<Text className="text-white">{item.message}</Text>
								</View>
							);
						}}
						contentContainerStyle={{
							paddingTop: 10,
						}}
						inverted
					/>

					{/* <LegendList
						keyExtractor={(item) => item.id}
						showsVerticalScrollIndicator={false}
						initialScrollIndex={messages?.docs.length ? messages.docs.length - 1 : 0}
						maintainScrollAtEnd
						maintainScrollAtEndThreshold={0.2}
						maintainVisibleContentPosition
						drawDistance={screenHeight * 0.8}
						alignItemsAtEnd
						// estimatedItemSize={40}
						getEstimatedItemSize={(index, item) => {
							const messageWidth = windowWidth * 0.9;
							return estimateTextHeight(item.message, messageWidth);
						}}
						waitForInitialLayout
						recycleItems={false}
						style={{
							marginBottom: 10,
						}}
						data={messages?.docs || []}
						renderItem={({ item }) => {
							return (
								<View
									className={cn(
										item.app_user === appUser?.user.id ? "self-end" : "self-start",
										"rounded-xl bg-green-500 px-4 py-2",
										"my-1",
									)}
								>
									<Text className="text-white">{item.message}</Text>
								</View>
							);
						}} 
					/> */}

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
									defaultValue={field.state.value}
									onChangeText={field.handleChange}
								/>
							)}
						</form.Field>

						<Pressable onPress={form.handleSubmit} disabled={mutationLogin.isPending}>
							<SendIcon size={24} color="#666" />
						</Pressable>
					</View>
				</Animated.View>
			</BackgroundLayout>
		</SafeAreaView>
	);
}
