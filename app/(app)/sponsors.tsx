import { ActivityIndicator, Alert, Platform, Pressable, Text, View, TextInput } from "react-native";
import BackgroundLayout, { stylesLayout } from "@/layouts/background-layout";
import { getSponsorsQuery } from "@/api/queries/sponsorsQueries";
import { useState, useRef, useMemo, useCallback } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import AnimatedMapMarker from "@/components/animated-marker";
import { useQuery } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import config from "@/tailwind.config";


export default function Page() {
	const [input, setInput] = useState<string>("");
	const mapRef = useRef<MapView>(null);
	const { error, isLoading, data } = useQuery({
		queryKey: ["sponsors"],
		queryFn: getSponsorsQuery,
	});

	// filter sponsors based on search input
	const filteredSponsors = useMemo(() => {
		if (!data?.docs) return [];
		if (!input || input.length < 2) return data.docs;

		const searchTerm = input.toLowerCase().trim();
		return data.docs.filter(
			(sponsor) =>
				sponsor.name.toLowerCase().includes(searchTerm) ||
				(sponsor.category && sponsor.category.toLowerCase().includes(searchTerm)),
		);
	}, [data?.docs, input]);

	if (error) {
		Alert.alert("Erreur de connexion", "Les sponsors n'ont pas pu être récupérés.");
	}

	return (
		<BackgroundLayout>
			<View className="flex-row items-center gap-4 bg-white p-4 pt-2">
				<View className="basis-8/12">
					<TextInput
						returnKeyType="search"
						autoCorrect={false}
						autoCapitalize="none"
						className="w-full rounded-xl bg-gray-100 p-4"
						placeholder="Rechercher..."
						onSubmitEditing={(elem) => {
							setInput(elem.nativeEvent.text.trim());
						}}
					/>
					<FontAwesome
						className="absolute right-4 top-1/2 z-10 -translate-y-1/2"
						name="search"
						size={18}
						color={config.theme.extend.colors.defaultGray}
					/>
				</View>
				<Pressable className="grow rounded-xl p-4 bg-black/85">
					<Text className="text-center font-bold text-white">Catégories</Text>
				</Pressable>
			</View>
			<View className="flex-1">
				<MapView
					ref={mapRef}
					provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
					style={stylesLayout.full}
					loadingEnabled={false}
					loadingBackgroundColor={config.theme.extend.colors.background}
					loadingIndicatorColor="transparent"
					zoomTapEnabled={true}
				>
					{filteredSponsors.map(
						(doc, idx) =>
							doc.latitude &&
							doc.longitude && (
								<AnimatedMapMarker
									key={doc.id}
									latitude={doc.latitude}
									longitude={doc.longitude}
									title={doc.name}
									description={doc.website ?? ""}
									delay={idx * 50}
									image={doc.logo}
									customCallout={true}
								/>
							),
					)}
				</MapView>
				{isLoading && (
					<ActivityIndicator
						className="absolute bottom-0 left-0 right-0 top-0"
						size="large"
						color={config.theme.extend.colors.defaultGray}
					/>
				)}
				{!isLoading && filteredSponsors.length === 0 && (
					<View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-white/60">
						<Text className="text-lg font-bold text-gray-800">Aucun sponsor trouvé</Text>
						<Text className="text-gray-700">Essayez une autre recherche</Text>
					</View>
				)}
			</View>
		</BackgroundLayout>
	);
}
