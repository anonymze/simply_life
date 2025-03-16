import { SimpleLineIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native";
import { Link } from "expo-router";


export default function HeaderLayout({ title }: { title: string }) {
	return (
		<View className="flex-row items-center justify-center bg-white p-4">
			<Link href="../" className="absolute left-4 w-10 py-3">
				<SimpleLineIcons name="arrow-left" size={20} color="black" />
			</Link>
			<Text className="text-lg font-bold">{title}</Text>
		</View>
	);
}
