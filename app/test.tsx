import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import BackgroundLayout from "@/layouts/background-layout";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cssInterop } from "nativewind";
import config from "@/tailwind.config";
import { Link } from "expo-router";
import { Image } from "expo-image";


cssInterop(LinearGradient, {
	className: {
		target: "style",
	},
});

cssInterop(Pressable, {
	className: {
		target: "style",
	},
});

cssInterop(Image, {
	className: {
		target: "style",
	},
});

export default function Page() {
	return (
		<BackgroundLayout>
			<LinearGradient
				className="h-[60%] w-full"
				colors={[config.theme.extend.colors.primaryLight, config.theme.extend.colors.primaryDark]}
			>
				<Link
					href="../"
					className="absolute left-10 top-10 items-center justify-center rounded-md bg-white p-4 active:opacity-80"
				>
					<SimpleLineIcons name="arrow-left" size={18} color="black" />
				</Link>
				<View className="absolute h-full w-full items-center justify-center">
					<View className="h-32 w-32 rounded-xl bg-white px-4">
						<Image source={require("@/assets/images/logo-full.png")} contentFit="contain" className="h-full w-full" />
					</View>
				</View>
			</LinearGradient>
			<View className="gap-6 p-6">
				<View className="h-18 w-full items-center justify-center rounded-xl bg-primary p-2">
					<FontAwesome6 name="handshake-simple" size={28} color="#fff" />
					<Text className="text-lg font-bold text-white">Nos partenaires</Text>
				</View>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 0 }}
					colors={[config.theme.extend.colors.secondaryLight, config.theme.extend.colors.secondaryDark]}
					className="h-18 w-full flex-row items-center justify-center gap-4 rounded-xl p-5"
				>
					<Ionicons name="phone-portrait" size={26} color="#fff" />
					<Text className="text-lg font-bold text-white">Réduction privées</Text>
				</LinearGradient>
			</View>
		</BackgroundLayout>
	);
}
