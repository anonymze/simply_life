import { SimpleLineIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { View } from "react-native";
import { Link } from "expo-router";


export default function HeaderLayout({ title }: { title: string }) {
	return (
		<View className="flex-row items-center justify-center bg-white p-4">
			<Link href="../" asChild className="absolute left-4 active:opacity-70">
				<Pressable>
					<SimpleLineIcons name="arrow-left" size={20} color="black" />
				</Pressable>
			</Link>
			<Text className="text-lg font-bold">{title}</Text>
		</View>
	);
}
