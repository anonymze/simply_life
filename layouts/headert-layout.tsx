import { SimpleLineIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { View } from "react-native";
import { Link } from "expo-router";


export default function Header({ title }: { title: string }) {
	return (
		<View className="w-full items-center justify-center bg-white p-4">
			<Link href="../" asChild>
				<Pressable className="absolute left-1 p-3 active:opacity-70">
					<SimpleLineIcons name="arrow-left" size={20} color="black" />
				</Pressable>
			</Link>
			<Text className="text-lg font-bold">{title}</Text>
		</View>
	);
}
