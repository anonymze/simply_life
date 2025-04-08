import { ActivityIndicator, Pressable, Text, View, TextInput } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { createChatRoomQuery } from "@/api/queries/chat-room-queries";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import BackgroundLayout from "@/layouts/background-layout";
import { useMutation } from "@tanstack/react-query";
import { getStorageUserInfos } from "@/utils/store";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import React from "react";
import { z } from "zod";


export default function Page() {
	const appUser = getStorageUserInfos();

	console.log(appUser);

	const languageCode = getLanguageCodeLocale();
	const mutationLogin = useMutation({
		mutationFn: createChatRoomQuery,
		onError: (error) => {
			console.log(error);
		},
		onSuccess: async (data) => {
			console.log(data);
			router.back();
		},
	});

	const formSchema = React.useMemo(
		() =>
			z.object({
				name: z.string().min(2, {
					message: i18n[languageCode]("ERROR_INPUT_MIN_LENGTH"),
				}),
				description: z.string(),
			}),
		[],
	);

	const form = useForm({
		// TODO: remove defaults
		defaultValues: {
			name: "Test",
			description: "Test description",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			mutationLogin.mutate({
				...value,
				app_user: appUser?.user.id || "",
				private: false,
				color: null,
				category: null,
			});
		},
	});

	return (
		<BackgroundLayout className="p-4">
			<View className="mt-8 w-full gap-3">
				<Text className="text-md self-start text-gray-500">{i18n[languageCode]("INPUT_NAME_NEW_ROOM")}</Text>
				<form.Field name="name">
					{(field) => (
						<React.Fragment>
							<TextInput
								returnKeyType="done"
								autoCapitalize="none"
								keyboardType="default"
								textContentType="oneTimeCode"
								placeholder="Matchs"
								className="w-full rounded-lg bg-gray-200 p-5 placeholder:text-gray-400"
								defaultValue={field.state.value}
								onChangeText={field.handleChange}
							/>
							{field.state.meta.errors.length > 0 && (
								<Text className="text-red-500">{field.state.meta.errors[0]?.message}</Text>
							)}
						</React.Fragment>
					)}
				</form.Field>
			</View>

			<View className="mt-3 w-full gap-3">
				<Text className="text-md self-start text-gray-500">{i18n[languageCode]("INPUT_DESCRIPTION_NEW_ROOM")}</Text>
				<form.Field name="description">
					{(field) => (
						<React.Fragment>
							<TextInput
								returnKeyType="done"
								autoCapitalize="none"
								keyboardType="default"
								textContentType="oneTimeCode"
								placeholder="Informations sur les matchs"
								className="w-full rounded-lg bg-gray-200 p-5 placeholder:text-gray-400"
								defaultValue={field.state.value}
								onChangeText={field.handleChange}
							/>
							{field.state.meta.errors.length > 0 && (
								<Text className="text-red-500">{field.state.meta.errors[0]?.message}</Text>
							)}
						</React.Fragment>
					)}
				</form.Field>
			</View>
			<Pressable
				onPress={form.handleSubmit}
				disabled={mutationLogin.isPending}
				className="mt-4 h-14 w-full items-center justify-center rounded-lg bg-primary disabled:opacity-70"
			>
				{mutationLogin.isPending ? (
					<Animated.View entering={FadeInDown.springify().duration(1200)} exiting={FadeOutUp.duration(300)}>
						<ActivityIndicator size="small" color="white" />
					</Animated.View>
				) : (
					<Text className="text-center text-white">{i18n[languageCode]("BUTTON_CREATE_ROOM")}</Text>
				)}
			</Pressable>
		</BackgroundLayout>
	);
}
