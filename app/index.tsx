import { BadgeInfoIcon, UserRoundIcon } from "lucide-react-native";
import { Text, View } from "react-native";


export default function Page() {
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<BadgeInfoIcon size={24} color="red" />
			<BadgeInfoIcon size={26} color="#000" />
		</View>
	)
}