import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, Text, View, TextInput, } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import BackgroundLayout from "@/layouts/background-layout";
import { loginQuery } from "@/api/queries/login-queries";
import { useMutation } from "@tanstack/react-query";
import { setStorageUserInfos } from "@/utils/store";
import { Fragment, useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import config from "@/tailwind.config";
import { router } from "expo-router";
import { Image } from "expo-image";
import { z } from "zod";


const formSchema = z.object({
	email: z.string().email({
		message: "L'email est invalide",
	}),
	password: z.string().min(8, {
		message: "Le mot de passe doit contenir au moins 8 caractères",
	}),
});

export default function Login() {
	const form = useForm({
		defaultValues: {
			email: "test@test.fr",
			password: "12341234",
		},
		validators: {
			onSubmit: formSchema,
		},
		onSubmit: ({ value }) => {
			console.log(value);
			mutationLogin.mutate({
				email: value.email,
				password: value.password,
			});
		},
	});

	const mutationLogin = useMutation({
		mutationFn: loginQuery,
		onError: (_) => {
			Alert.alert("Erreur de connexion", "Vérifiez vos identifiants.");
		},
		onSuccess: async (data) => {
			setStorageUserInfos(data);
			router.replace("/(app)");
		},
	});

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1, backgroundColor: config.theme.extend.colors.background }}
			keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
		>
			<BackgroundLayout>
				<View className="flex-1 items-center justify-center gap-3 p-6">
					<Image
						source={require("@/assets/images/logo-full.png")}
						style={{ height: 80, width: 200 }}
						contentFit="contain"
					/>
					<Text className="text-center text-lg font-semibold">
						La gestion de votre quotidien professionnelle n'a jamais été aussi simplifiée.
					</Text>

					<form.Field name="email">
						{(field) => (
							<View className="mt-8 w-full gap-3">
								<Text className="text-md self-start text-gray-500">Votre email de connexion :</Text>
								<TextInput
									returnKeyType="done"
									autoCapitalize="none"
									keyboardType="default"
									textContentType="oneTimeCode"
									placeholder="nom@email.fr"
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
								<Text className="text-md self-start text-gray-500">Votre mot de passe :</Text>
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
							<Text className="text-center text-white">Connexion</Text>
						)}
					</Pressable>
				</View>
			</BackgroundLayout>
		</KeyboardAvoidingView>
	);
}
