import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View, } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import BackgroundLayout from "@/layouts/background-layout";
import { loginQuery } from "@/api/queries/loginQueries";
import { useMutation } from "@tanstack/react-query";
import { setStorageUserInfos } from "@/utils/store";
import { useRef, useState } from "react";
import config from "@/tailwind.config";
import { router } from "expo-router";
import { Image } from "expo-image";


export default function Login() {
	const inputEmailRef = useRef<TextInput>(null);
	const inputPasswordRef = useRef<TextInput>(null);
	const [inputs, setInputs] = useState({
		email: process.env.EXPO_PUBLIC_DEFAULT_USER_EMAIL || "",
		password: process.env.EXPO_PUBLIC_DEFAULT_USER_PASSWORD || "",
	});
	const mutationLogin = useMutation({
		mutationFn: loginQuery,
		onError: (error) => {
			console.log(error);
			// router.replace("/");
		},
		onSuccess: (response) => {
			console.log(response.data);
			setStorageUserInfos(response.data);
			router.replace("/");
		},
	});

	const handleLogin = async () => {
		if (!inputs.email) {
			inputEmailRef.current?.focus();
			return;
		}

		if (!inputs.password) {
			inputPasswordRef.current?.focus();
			return;
		}

		mutationLogin.mutate(inputs);
	};

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
					<Text className="text-md mt-10 self-start text-gray-500">Votre email :</Text>
					<TextInput
						ref={inputEmailRef}
						returnKeyType="done"
						onBlur={(elem) => setInputs({ ...inputs, email: elem.nativeEvent.text })}
						autoCapitalize="none"
						placeholder="nom@email.fr"
						className="w-full rounded-lg bg-gray-200 p-5 placeholder:text-gray-400"
					/>
					<Text className="text-md mt-2 self-start text-gray-500">Votre mot de passe :</Text>
					<TextInput
						ref={inputPasswordRef}
						returnKeyType="done"
						onBlur={(elem) => setInputs({ ...inputs, password: elem.nativeEvent.text })}
						secureTextEntry
						autoCapitalize="none"
						placeholder="mot de passe"
						className="w-full rounded-lg bg-gray-200 p-5 placeholder:text-gray-400"
					/>
					<Pressable
						onPress={() => {
							if (mutationLogin.isPending) return;
							handleLogin();
						}}
						className="mt-5 h-14 w-full items-center justify-center rounded-lg bg-primary"
					>
						<Text className="text-center text-white">
							{mutationLogin.isPending ? (
								<Animated.View entering={FadeInDown.springify().duration(1200)} exiting={FadeOutUp.duration(300)}>
									<ActivityIndicator size="small" color="white" />
								</Animated.View>
							) : (
								"Connexion"
							)}
						</Text>
					</Pressable>
				</View>
			</BackgroundLayout>
		</KeyboardAvoidingView>
	);
}
