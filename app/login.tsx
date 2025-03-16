import Animated, { FadeInDown, FadeOutUp, useAnimatedStyle } from "react-native-reanimated";
import { ActivityIndicator, Alert, Pressable, Text, View, TextInput, } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import BackgroundLayout from "@/layouts/background-layout";
import { loginQuery } from "@/api/queries/login-queries";
import { useMutation } from "@tanstack/react-query";
import { setStorageUserInfos } from "@/utils/store";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { Image } from "expo-image";
import React from "react";
import { z } from "zod";


export default function Login() {
	const { height } = useReanimatedKeyboardAnimation();
	const languageCode = getLanguageCodeLocale();
	
	const formSchema = React.useMemo(() => z.object({
		email: z.string().email({
			message: i18n[languageCode]("ERROR_EMAIL_INVALID"),
		}),
		password: z.string().min(8, {
			message: i18n[languageCode]("ERROR_PASSWORD_MIN_LENGTH"),
		}),
	}), []);
	
	const form = useForm({
		defaultValues: {
			email: "test@test.fr",
			password: "12341234",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			mutationLogin.mutate({
				email: value.email,
				password: value.password,
			});
		},
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: height.value / 2 }],
		};
	});

	const mutationLogin = useMutation({
		mutationFn: loginQuery,
		onError: (_) => {
			Alert.alert(i18n[languageCode]("ERROR_LOGIN"), i18n[languageCode]("ERROR_LOGIN_MESSAGE"));
		},
		onSuccess: async (data) => {
			setStorageUserInfos(data);
			router.replace("/(app)");
		},
	});

	return (
			<BackgroundLayout>
				<Animated.View className="flex-1 items-center justify-center gap-3 p-6" style={animatedStyle}>
					<Image
						source={require("@/assets/images/logo-full.png")}
						style={{ height: 80, width: 200 }}
						contentFit="contain"
					/>
					<Text className="text-center text-lg font-semibold">
						{i18n[languageCode]("SUBTITLE_LOGIN")}
					</Text>

					<form.Field name="email">
						{(field) => (
							<View className="mt-8 w-full gap-3">
								<Text className="text-md self-start text-gray-500">{i18n[languageCode]("INPUT_EMAIL_LOGIN")}</Text>
								<TextInput
									returnKeyType="done"
									autoCapitalize="none"
									keyboardType="default"
									textContentType="oneTimeCode"
									placeholder="test@email.com"
									className="w-full rounded-lg bg-gray-200 p-5 placeholder:text-gray-400"
									value={field.state.value}
									onChangeText={field.handleChange}
								/>
								{field.state.meta.errors.length > 0 && (
									<Text className="text-red-500">{field.state.meta.errors[0]?.message}</Text>
								)}
							</View>
						)}
					</form.Field>
					<form.Field name="password">
						{(field) => (
							<View className="mt-3 w-full gap-3">
								<Text className="text-md self-start text-gray-500">{i18n[languageCode]("INPUT_PASSWORD_LOGIN")}</Text>
								<TextInput
									secureTextEntry
									returnKeyType="done"
									autoCapitalize="none"
									keyboardType="default"
									textContentType="oneTimeCode"
									placeholder="********"
									className="w-full rounded-lg bg-gray-200 p-5 placeholder:text-gray-400"
									value={field.state.value}
									onChangeText={field.handleChange}
								/>
								{field.state.meta.errors.length > 0 && (
									<Text className="text-red-500">{field.state.meta.errors[0]?.message}</Text>
								)}
							</View>
						)}
					</form.Field>
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
							<Text className="text-center text-white">{i18n[languageCode]("BUTTON_LOGIN")}</Text>
						)}
					</Pressable>
				</Animated.View>
			</BackgroundLayout>
	);
}
