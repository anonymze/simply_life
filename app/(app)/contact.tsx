import { ActivityIndicator, Alert, Platform, Pressable, Text, View, TextInput } from "react-native";
import { getContactCategoriesQuery } from "@/api/queries/contact-categories-queries";
import BackgroundLayout, { stylesLayout } from "@/layouts/background-layout";
import { BottomSheetSelect } from "@/components/bottom-sheet-select";
import { getContactsQuery } from "@/api/queries/contact-queries";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import AnimatedMapMarker from "@/components/animated-marker";
import { ContactCategory } from "@/types/contact";
import { useQuery } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import config from "@/tailwind.config";
import React from "react";


export default function Page() {
	const bottomSheetRef = React.useRef<BottomSheet>(null);
	const [selectedCategories, setSelectedCategories] = React.useState<ContactCategory[]>([]);
	const [input, setInput] = React.useState<string>("");
	const mapRef = React.useRef<MapView>(null);
	const {
		error: errorContacts,
		isLoading: isLoadingContacts,
		data: dataContacts,
	} = useQuery({
		queryKey: ["contacts"],
		queryFn: getContactsQuery,
	});
	const { isLoading: isLoadingCategoryContacts, data: dataCategoryContacts } = useQuery({
		queryKey: ["contact-categories"],
		queryFn: getContactCategoriesQuery,
	});

	// filter contacts based on search input and selected categories
	const filteredContacts = React.useMemo(() => {
		if (!dataContacts?.docs) return [];

		// return all contacts if no filters are applied
		if (input.length < 2 && selectedCategories.length === 0) return dataContacts.docs;

		const searchTerm = input.toLowerCase().trim();
		const hasSearchTerm = searchTerm.length >= 2;
		const hasCategories = selectedCategories.length > 0;

		return dataContacts.docs.filter((contact) => {
			// text search condition
			const matchesSearch = !hasSearchTerm || contact.name.toLowerCase().includes(searchTerm);

			// category filter condition
			const matchesCategory =
				!hasCategories || selectedCategories.some((category) => category.name === contact.category.name);

			// Both conditions must be true
			return matchesSearch && matchesCategory;
		});
	}, [dataContacts?.docs, input, selectedCategories]);

	if (errorContacts) {
		Alert.alert("Erreur de connexion", "Les contacts n'ont pas pu être récupérés.");
	}

	return (
		<BackgroundLayout>
			<View className="flex-row items-center gap-4 bg-white p-4 pt-2">
				<View className="basis-8/12">
					<TextInput
						editable={!isLoadingContacts && !isLoadingCategoryContacts}
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
					disabled={isLoadingContacts || isLoadingCategoryContacts}
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
					// 	if (filteredContacts.length > 0) {
					// 		const coordinates = filteredContacts
					// 			.filter(contact => contact.latitude && contact.longitude)
					// 			.map(contact => ({
					// 				latitude: Number(contact.latitude),
					// 				longitude: Number(contact.longitude),
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
					{filteredContacts.map(
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
				{isLoadingContacts && (
					<ActivityIndicator
						className="absolute bottom-0 left-0 right-0 top-0"
						size="large"
						color={config.theme.extend.colors.defaultGray}
					/>
				)}
				{!isLoadingContacts && filteredContacts.length === 0 && (
					<View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-white/60">
						<Text className="text-lg font-bold text-gray-800">Aucun contact trouvé</Text>
					</View>
				)}
			</View>
			<BottomSheetSelect
				ref={bottomSheetRef}
				data={dataCategoryContacts?.docs ?? []}
				onSelect={(item) => {
					setSelectedCategories(item as ContactCategory[]);
				}}
			/>
		</BackgroundLayout>
	);
}
