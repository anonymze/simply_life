import { ActivityIndicator, Alert, Platform, Pressable, Text, View, TextInput } from "react-native";
import BackgroundLayout, { stylesLayout } from "@/layouts/background-layout";
import { getSponsorsQuery } from "@/api/queries/sponsorsQueries";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import config from "@/tailwind.config";
import { useState } from "react";


export default function Page() {
	const [input, setInput] = useState<string>("");
	const { category } = useLocalSearchParams<{ category?: string }>();
	const { error, isLoading, data, } = useQuery({
		queryKey: ["sponsors", { category, name: input }],
		queryFn: getSponsorsQuery,
	});

	console.log(data.docs[0]);

	if (error) {
		Alert.alert("Erreur de connexion", "Les sponsors n'ont pas pu être récupérés.");
	}

	return (
		<BackgroundLayout>
			<View className="flex-row items-center gap-4 p-4 pt-2 bg-white">
				<View className="basis-8/12">
					<TextInput
						returnKeyType="done"
						autoCorrect={false}
						autoCapitalize="none"
						className="w-full rounded-xl bg-gray-100 p-4"
						placeholder="Rechercher..."
						onBlur={(elem) => {
							setInput(elem.nativeEvent.text);
						}}
					/>
					<FontAwesome
						className="absolute right-4 top-1/2 z-10 -translate-y-1/2"
						name="search"
						size={18}
						color={config.theme.extend.colors.defaultGray}
					/>
				</View>
				<Pressable className="grow rounded-xl bg-dark p-4">
					<Text className="text-center font-bold text-white">Catégories</Text>
				</Pressable>
			</View>
			<View className="flex-1">
				<MapView
					provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
					style={stylesLayout.full}
					loadingEnabled={true}
					zoomTapEnabled={true}
					loadingIndicatorColor="transparent"
					loadingBackgroundColor={config.theme.extend.colors.background}
				/>
				{isLoading && (
					<ActivityIndicator className="absolute bottom-0 left-0 right-0 top-0" size="large" color={config.theme.extend.colors.defaultGray} />
				)}
			</View>
		</BackgroundLayout>
	);
}
