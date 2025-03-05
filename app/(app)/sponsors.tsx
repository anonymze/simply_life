import { ActivityIndicator, Alert, Platform, Pressable, Text, View, TextInput } from "react-native";
import { getSponsorCategoriesQuery } from "@/api/queries/sponsor-categories-query";
import BackgroundLayout, { stylesLayout } from "@/layouts/background-layout";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetSelect } from "@/components/bottom-sheet-select";
import { getSponsorsQuery } from "@/api/queries/sponsors-queries";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import AnimatedMapMarker from "@/components/animated-marker";
import { SponsorCategory } from "@/types/sponsor";
import { useQuery } from "@tanstack/react-query";
import BottomSheet from "@gorhom/bottom-sheet";
import config from "@/tailwind.config";
import React from "react";


export default function Page() {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedCategories, setSelectedCategories] = React.useState<SponsorCategory[]>([]);
	const [input, setInput] = React.useState<string>("");
	const mapRef = React.useRef<MapView>(null);
	const { error: errorSponsors, isLoading: isLoadingSponsors, data: dataSponsors } = useQuery({
		queryKey: ["sponsors"],
		queryFn: getSponsorsQuery,
	});
	const { error: errorCategorySponsors, isLoading: isLoadingCategorySponsors, data: dataCategorySponsors } = useQuery({
		queryKey: ["sponsor-categories"],
		queryFn: getSponsorCategoriesQuery,
	});

	console.log(dataCategorySponsors);

	// filter sponsors based on search input and selected categories
	const filteredSponsors = React.useMemo(() => {
		if (!dataSponsors?.docs) return [];

		// return all sponsors if no filters are applied
		if (input.length < 2 && selectedCategories.length === 0) return dataSponsors.docs;

		const searchTerm = input.toLowerCase().trim();
		const hasSearchTerm = searchTerm.length >= 2;
		const hasCategories = selectedCategories.length > 0;

		return dataSponsors.docs.filter((sponsor) => {
			// text search condition
			const matchesSearch =
				!hasSearchTerm ||
				sponsor.name.toLowerCase().includes(searchTerm)

			// category filter condition
			const matchesCategory =
				!hasCategories || selectedCategories.some((category) => category.name === sponsor.category.name);

			// Both conditions must be true
			return matchesSearch && matchesCategory;
		});
	}, [dataSponsors?.docs, input, selectedCategories]);

	if (errorSponsors) {
		Alert.alert("Erreur de connexion", "Les sponsors n'ont pas pu être récupérés.");
	}

	return (
		<BackgroundLayout>
			<View className="flex-row items-center gap-4 bg-white p-4 pt-2">
				<View className="basis-8/12">
					<TextInput
						editable={!isLoadingSponsors && !isLoadingCategorySponsors}
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
						className="absolute right-4 top-4"
						name="search"
						size={18}
						color={config.theme.extend.colors.defaultGray}
					/>
				</View>
				<Pressable
					disabled={isLoadingSponsors || isLoadingCategorySponsors}
					className="grow rounded-xl bg-black/85 p-4 disabled:opacity-80"
					onPress={() => {
						bottomSheetRef.current?.expand();
					}}
				>
					<Text className="text-center font-bold text-white">Catégories</Text>
				</Pressable>
			</View>
			<View className="flex-1">
				<MapView
					ref={mapRef}
					provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
					style={stylesLayout.full}
					loadingEnabled={false}
					zoomTapEnabled={true}
					// onMapReady={() => {
					// 	// fit to markers when map is ready
					// 	if (filteredSponsors.length > 0) {
					// 		const coordinates = filteredSponsors
					// 			.filter(sponsor => sponsor.latitude && sponsor.longitude)
					// 			.map(sponsor => ({
					// 				latitude: Number(sponsor.latitude),
					// 				longitude: Number(sponsor.longitude),
					// 			}));

					// 		if (coordinates.length > 0) {
					// 			mapRef.current?.fitToCoordinates(coordinates, {
					// 				edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
					// 				animated: true,
					// 			});
					// 		}
					// 	}
					// }}
					
				>
					{filteredSponsors.map(
						(doc, idx) =>
							doc.latitude &&
							doc.longitude && (
								<AnimatedMapMarker
									key={`${doc.id}-${idx}`}
									latitude={Number(doc.latitude)}
									longitude={Number(doc.longitude)}
									title={doc.name}
									description={doc.website ?? ""}
									delay={idx * 50}
									image={doc.logo}
									customCallout={true}
								/>
							),
					)}
				</MapView>
				{isLoadingSponsors && (
					<ActivityIndicator
						className="absolute bottom-0 left-0 right-0 top-0"
						size="large"
						color={config.theme.extend.colors.defaultGray}
					/>
				)}
				{!isLoadingSponsors && filteredSponsors.length === 0 && (
					<View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-white/60">
						<Text className="text-lg font-bold text-gray-800">Aucun sponsor trouvé</Text>
					</View>
				)}
			</View>
			<BottomSheetSelect
				ref={bottomSheetRef}
				data={dataCategorySponsors?.docs ?? []}
				onSelect={(item) => {
					setSelectedCategories(item);
				}}
			/>
		</BackgroundLayout>
	);
}
