import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import { SafeAreaView } from "react-native-safe-area-context";
import BackgroundLayout from "@/layouts/background-layout";
import { Pressable } from "react-native-gesture-handler";
import { loginQuery } from "@/api/queries/login-queries";
import { View, Text, TextInput } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { SendIcon } from "lucide-react-native";
import { LegendList } from "@legendapp/list";
import React from "react";
import { z } from "zod";


export default function Page() {
	const { height } = useReanimatedKeyboardAnimation();
	const languageCode = React.useMemo(() => getLanguageCodeLocale(), []);
	const { chat: chatId } = useLocalSearchParams<{ chat?: string }>();
	const mutationLogin = useMutation({
		mutationFn: loginQuery,
		onError: (error) => {},
		onSuccess: async (data) => {},
	});

	if (!chatId) {
		return <Redirect href="../" />;
	}

	const formSchema = React.useMemo(
		() =>
			z.object({
				message: z.string().min(1, {
					message: i18n[languageCode]("ERROR_INPUT_MIN_LENGTH"),
				}),
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
		onSubmit: ({ value }) => {},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: height.value }],
		};
	});

	return (
		<SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
			<BackgroundLayout className="px-6 pt-6 ">
				<Stack.Screen options={{ title: chatId }} />
				<Animated.View className="flex-1" style={animatedStyle}>
					<LegendList
						style={{ flex: 1 }}
						data={[]}
						renderItem={({ item }) => {
							return (
								<View>
									<Text>oki</Text>
								</View>
							);
						}}
					/>
					<View className="flex-row items-center gap-2">
						<form.Field name="message">
							{(field) => (
								<TextInput
									returnKeyType="default"
									autoCapitalize="none"
									keyboardType="default"
									submitBehavior="newline"
									multiline={true}
									placeholder={`${i18n[languageCode]("MESSAGE")}...`}
									className="min-h-10 flex-1"
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
