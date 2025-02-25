import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, FadeOutUp } from "react-native-reanimated";
import BackgroundLayout from "@/layouts/background-layout";
import config from "@/tailwind.config";
import { Image } from "expo-image";
import { useState } from "react";


export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setLoading(false);
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
						returnKeyType="done"
						onBlur={(elem) => setEmail(elem.nativeEvent.text)}
						autoCapitalize="none"
						placeholder="nom@email.fr"
						className="w-full rounded-lg bg-gray-200 p-5 placeholder:text-gray-400"
					/>
					<Text className="text-md mt-2 self-start text-gray-500">Votre mot de passe :</Text>
					<TextInput
						returnKeyType="done"
						onBlur={(elem) => setPassword(elem.nativeEvent.text)}
						secureTextEntry
						autoCapitalize="none"
						placeholder="mot de passe"
						className="w-full rounded-lg bg-gray-200 p-5 placeholder:text-gray-400"
					/>
					<Pressable
						onPress={handleLogin}
						className="mt-5 h-14 w-full items-center justify-center rounded-lg bg-primary"
					>
						<Text className="text-center text-white">
							{loading ? (
								<Animated.View entering={FadeInDown.springify().duration(1200)} exiting={FadeOutUp.duration(200)}>
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
