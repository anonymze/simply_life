import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";


export default function Page() {
	const { chat: chatId } = useLocalSearchParams();
	console.log(chatId);
	return (
		<View>
			<Text>Chat {chatId}</Text>
		</View>
	)
}