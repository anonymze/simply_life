// @ts-expect-error
import { setIcon, getActiveIcon, resetIcon } from "react-native-app-icon-changer";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import config from "@/tailwind.config";
import { useEffect } from "react";


export default function Page() {
	useEffect(() => {
		setIcon("Secondary");

		// resetIcon();
	}, []);

	return (
		<ParallaxScrollView
			headerBackgroundColor={{
				start: config.theme.extend.colors.primaryLight,
				end: config.theme.extend.colors.primaryDark,
			}}
		>
			<View className="gap-6">
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.buttons}
					colors={[config.theme.extend.colors.primaryLight, config.theme.extend.colors.primaryDark]}
				>
					<FontAwesome6 name="handshake-simple" size={28} color="#fff" />
					<Text className="text-lg font-bold text-white">Nos partenaires</Text>
				</LinearGradient>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					style={styles.buttons}
					colors={[config.theme.extend.colors.secondaryLight, config.theme.extend.colors.secondaryDark]}
				>
					<Ionicons name="phone-portrait" size={26} color="#fff" />
					<Text className="text-lg font-bold text-white">Réduction privées</Text>
				</LinearGradient>
			</View>
		</ParallaxScrollView>
	);
}

const styles = StyleSheet.create({
	buttons: {
		height: 80,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 12,
	},
});
